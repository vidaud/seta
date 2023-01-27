from interface import implements
from repository.interfaces.users_broker import IUsersBroker

from injector import inject
from repository.interfaces.config import IDbConfig

from datetime import datetime, timedelta, timezone
from pymongo.results import InsertManyResult

from repository.models import SetaUser, ExternalProvider, UserClaim, EntityScope, SystemScope
from infrastructure.scope_constants import CommunityScopeConstants

class UsersBroker(implements(IUsersBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
       self.db = config.get_db()
    
    #---------------- Public methods ----------------#
    
    def authenticate_user(self, auth_user: SetaUser) -> SetaUser:
        seta_user = self._get_user_by_email(auth_user.email)
        
        if seta_user is not None:
            for p in seta_user.external_providers:
                if p.provider_uid == auth_user.authenticated_provider.provider_uid and p.provider == auth_user.authenticated_provider.provider:
                    seta_user.authenticated_provider = p
                    
            if seta_user.authenticated_provider is None:
                seta_user.authenticated_provider = ExternalProvider(seta_user.user_id, 
                                     auth_user.authenticated_provider.provider_uid,
                                     auth_user.authenticated_provider.provider,
                                     auth_user.authenticated_provider.domain)
                
                self._create_external_provider(seta_user.authenticated_provider)
        else:
            seta_user = self._create_new_user(auth_user)
            
        return seta_user  
    
    def get_user_by_id_and_provider(self, user_id: str, provider_uid: str, provider: str) -> SetaUser:
        collection = self.db["users"]
        filter = {"user_id": user_id}
        
        user = collection.find_one(filter)
        
        if user is None:
            return None
        
        provider = self._get_external_provider(user_id,provider_uid, provider)
                
        if provider is None:
            #print("No provider_uid '"+provider_uid+"' and provider '" + provider + "'")
            return None
        
        if user["user_id"] != provider.user_id:
            #print(user["user_id"] + " != " + provider.user_id)
            return None
        
        seta_user = SetaUser.from_db_json(user)
        seta_user.authenticated_provider = provider
        seta_user.claims = self._get_user_claims_from_db(user_id)
        
        return seta_user
        
    
    def get_user_by_id(self, user_id: str) -> SetaUser:
        collection = self.db["users"]
        filter = {"user_id": user_id}
        
        user = collection.find_one(filter)
        
        if user is None:
            return None
        
        seta_user = SetaUser.from_db_json(user)
        seta_user.external_providers = self._get_user_providers_from_db(seta_user.user_id)            
        seta_user.claims = self._get_user_claims_from_db(seta_user.user_id)

        seta_user.community_scopes = self._get_community_scopes_from_db(seta_user.user_id)
        seta_user.resource_scopes = self._get_resource_scopes_from_db(seta_user.user_id)
        seta_user.system_scopes = self._get_system_scopes_from_db(seta_user.user_id)
            
        return seta_user
    
    #-------------------------------------------------------#
    
    '''
    def add_user(self, user: Any):
        usersCollection = self.db["users"]
        if user.get("role") is None:
            user["role"] = "user"

        u = {
            "username": user["uid"],
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "email": user["email"],
            "domain": user["domain"],
            "role": user["role"],
            "created-at": str(datetime.now())
        }

        usersCollection.insert_one(u)
    '''
    '''
    def get_user_by_username(self, username: str):
        usersCollection = self.db["users"]
        uq = {"username": username, "email":{"$exists" : True}}

        return usersCollection.find_one(uq)
    '''
    
    '''
    def update_user(self, username: str, field: str, value: Any):
        usersCollection = self.db["users"]
        userQuery = {"username": username}

        user = usersCollection.find_one(userQuery)
        if user is None:
            return

        updateParameter = {"$set": {field: value, "modified-at": str(time.time())}}

        usersCollection.update_one({"username": username}, updateParameter)
    '''
    
    def move_documents(self, sourceCollection: str, targetCollection: str, filter: dict):
        sc = self.db[sourceCollection]
        tc = self.db[targetCollection]
        
        sourceDocs = sc.find(filter)
        result: InsertManyResult = tc.insert_many(sourceDocs, False, True)
        
        now = datetime.now(timezone.utc)
        tc.update_many({"_id": {"$in": result.inserted_ids}}, {"$set": {"revoked_at": now}})
        
        r = sc.delete_many({"_id": {"$in": result.inserted_ids}})
        return r.deleted_count
    
    def delete_old_user(self):
        ar = self.db["archive"]
        now = datetime.now(timezone.utc)
        nowMinusThreeWeeks = str(now - timedelta(weeks=3))
        r = ar.delete_many({
            "$or": [
                {"created_at": {"$lt":  nowMinusThreeWeeks}},
                {"revoked_at": {"$lt":  nowMinusThreeWeeks}}
            ]
        })
        return r.deleted_count
    
     #-------------Private methods ----------------------#        
    def user_uid_exists(self, user_id: str) -> bool:
        collection = self.db["users"]
        filter = {"user_id": user_id, "email": {"$exists" : True}}
                
        if  collection.count_documents(filter, limit = 1):
            return True
        return False
    
    def _create_new_user(self, user: SetaUser) -> SetaUser:
        collection = self.db["users"]
        
        with self.db.client.start_session(causal_consistency=True) as session:
                uid_exists = self.user_uid_exists(user.user_id)
                
                #check if the generated id for this new user already exists in the db
                while uid_exists:
                    user.user_id = SetaUser.generate_uuid()
                    uid_exists = self.user_uid_exists(user.user_id)
                
                #inser user record
                collection.insert_one(user.to_json(), session=session)       
        
                #insert provider records
                collection.insert_one(user.authenticated_provider.to_json(), session=session)                
        
                #insert claims
                if len(user.claims) > 0:
                    for claim in user.claims:
                        collection.insert_one(claim.to_json(), session=session)
                        
                #insert default system scopes
                scopes = [
                    SystemScope(user.user_id, CommunityScopeConstants.Create, "community").to_json()
                          ]
                collection.insert_many(scopes, session=session)

        
        return user     
        
    
    def _create_external_provider(self, provider: ExternalProvider):
        collection = self.db["users"]
         
        collection.insert_one(provider.to_json())    
    
    def _get_external_provider(self, user_id: str, provider_uid: str, provider: str) -> ExternalProvider:
        collection = self.db["users"]
        pFilter = {"user_id": user_id, "provider_uid": provider_uid, "provider": provider}
        provider = collection.find_one(pFilter)
        
        if provider is None:
            return None
        
        return ExternalProvider.from_db_json(provider)
    
    def _get_user_by_email(self, email: str) -> SetaUser:
        if not email:
            return None
        
        collection = self.db["users"]
        
        '''
        filter = {"email": email}
        #case insesitive search
        collation={
            'locale': 'en', 
            'strength': 2
        }

        user = collection.find_one(filter=filter, collation=collation)
        '''
        
        user = collection.find_one({"email": email.lower()})
        if user is None:
            return None
        
        seta_user = SetaUser.from_db_json(user)
        seta_user.external_providers = self._get_user_providers_from_db(seta_user.user_id)            
        seta_user.claims = self._get_user_claims_from_db(seta_user.user_id)
            
        return seta_user
    
    def _get_user_providers_from_db(self, user_id: str) -> list[ExternalProvider]:
        user_providers = []
        collection = self.db["users"]
        
        pFilter = {"user_id": user_id, "provider":{"$exists" : True}}
        providers = collection.find(pFilter)
        
        for provider in providers:
            user_providers.append(ExternalProvider.from_db_json(provider))
            
        return user_providers
    
    def _get_user_claims_from_db(self, user_id: str) -> list[UserClaim]:
        user_claims = []
        collection = self.db["users"]
        
        cFilter = {"user_id": user_id, "claim_type":{"$exists" : True}}
        claims =  collection.find(cFilter)
        
        for claim in claims:
            user_claims.append(UserClaim.from_db_json(claim))
            
        return user_claims

    def _get_resource_scopes_from_db(self, user_id: str) -> list[EntityScope]:
        resource_scopes = []
        collection = self.db["users"]
        
        cFilter = {"user_id": user_id, "resource_scope":{"$exists" : True}}
        scopes =  collection.find(cFilter)
        
        for scope in scopes:
            resource_scopes.append(EntityScope.resource_from_db_json(scope))
            
        return resource_scopes

    def _get_community_scopes_from_db(self, user_id: str) -> list[EntityScope]:
        community_scopes = []
        collection = self.db["users"]
        
        cFilter = {"user_id": user_id, "community_scope":{"$exists" : True}}
        scopes =  collection.find(cFilter)
        
        for scope in scopes:
            community_scopes.append(EntityScope.community_from_db_json(scope))
            
        return community_scopes

    def _get_system_scopes_from_db(self, user_id: str) -> list[SystemScope]:
        system_scopes = []
        collection = self.db["users"]
        
        cFilter = {"user_id": user_id, "system_scope":{"$exists" : True}}
        scopes =  collection.find(cFilter)
        
        for scope in scopes:
            system_scopes.append(SystemScope.from_db_json(scope))
            
        return system_scopes
                
    #-------------------------------------------------------#