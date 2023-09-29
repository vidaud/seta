from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, IUsersBroker
from .db_user_permissions import UserPermissionsBroker
from .db_external_provider_broker import ExternalProviderBroker

from seta_flask_server.repository.models import SetaUser, SetaUserExt, ExternalProvider, UserClaim
from seta_flask_server.infrastructure.constants import ClaimTypeConstants, UserStatusConstants

from datetime import datetime
import pytz

class UsersBroker(implements(IUsersBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.config = config
        self.db = config.get_db()
        self.collection = self.db["users"]

        self.providerBroker = ExternalProviderBroker(config)
    
    #---------------- Public methods ----------------#
    
    def authenticate_user(self, auth_user: SetaUser) -> SetaUser:
        seta_user = self.get_user_by_email(auth_user.email)
        
        if seta_user is not None:
            if seta_user.status != UserStatusConstants.Active:
                return None
            
            provider_uid = auth_user.authenticated_provider.provider_uid
            provider_name = auth_user.authenticated_provider.provider
            
            seta_user.authenticated_provider = next(filter(lambda p: p.provider_uid == provider_uid and p.provider == provider_name, 
                                                           seta_user.external_providers), None)
                    
            if seta_user.authenticated_provider is None:
                auth_provider = ExternalProvider(user_id=seta_user.user_id, 
                                     provider_uid=auth_user.authenticated_provider.provider_uid,
                                     provider=auth_user.authenticated_provider.provider,
                                     first_name=auth_user.authenticated_provider.first_name,
                                     last_name=auth_user.authenticated_provider.last_name,
                                     domain=auth_user.authenticated_provider.domain)
                
                seta_user.authenticated_provider = auth_provider
                self.collection.insert_one(auth_provider.to_json())
        else:
            seta_user = self._create_new_user(auth_user)
            
        return seta_user  
    
    def get_user_by_id_and_provider(self, user_id: str, provider_uid: str, provider: str, load_scopes: bool = False) -> SetaUser:       
               
        seta_user = self.get_user_by_id(user_id=user_id, load_scopes=load_scopes)
        
        if seta_user is None:
            return None
        
        seta_user.authenticated_provider = next(filter(lambda p: p.provider_uid == provider_uid.lower() and p.provider == provider.lower(), 
                                                           seta_user.external_providers), None)        
                
        if seta_user.authenticated_provider is None:
            return None
        
        return seta_user
       
    def get_user_by_id(self, user_id: str, load_scopes: bool = True) -> SetaUser:
        filter = {"user_id": user_id, "email": {"$exists" : True}}
        
        user = self.collection.find_one(filter)
        
        if user is None:
            return None
        
        seta_user = SetaUser.from_db_json(user)
        seta_user.external_providers = self.providerBroker.get_by_user(seta_user.user_id)            
        seta_user.claims = self._get_user_claims_from_db(seta_user.user_id)

        if load_scopes:
            permissionsBroker = UserPermissionsBroker(config=self.config)
            seta_user.community_scopes = permissionsBroker.get_all_user_community_scopes(seta_user.user_id)
            seta_user.resource_scopes = permissionsBroker.get_all_user_resource_scopes(seta_user.user_id)
            seta_user.system_scopes = permissionsBroker.get_all_user_system_scopes(seta_user.user_id)
            
        return seta_user
    
    def get_user_by_email(self, email: str) -> SetaUser:
        if not email:
            return None
        
        user = self.collection.find_one({"email": email.lower()})
        if user is None:
            return None
        
        seta_user = SetaUser.from_db_json(user)
        seta_user.external_providers = self.providerBroker.get_by_user(seta_user.user_id)            
        seta_user.claims = self._get_user_claims_from_db(seta_user.user_id)
            
        return seta_user
    
    def user_uid_exists(self, user_id: str) -> bool:        
        filter = {"user_id": user_id, "email": {"$exists" : True}}
                
        return self.collection.count_documents(filter, limit = 1) > 0
    
    def update_status(self, user_id: str, status: str):
        now_date = datetime.now(tz=pytz.utc)
        
        filter = {"user_id": user_id, "email": {"$exists" : True}}
        set = {"$set": {"status": status, "modified_at": now_date}}
        
        self.collection.update_one(filter, set)

    def update_role(self, user_id: str, role: str):        
        filter = {"user_id": user_id, "claim_type": ClaimTypeConstants.RoleClaimType}
        set = {"$set": {"claim_value": role}}
        
        self.collection.update_one(filter, set)
    
    def delete(self, user_id: str):
        pass
    
    #-------------------------------------------------------#
    
    #-------------Private methods ----------------------#        
    
    
    def _create_new_user(self, user: SetaUser) -> SetaUser:        
        
        with self.db.client.start_session(causal_consistency=True) as session:
                uid_exists = self.user_uid_exists(user.user_id)
                
                #check if the generated id for this new user already exists in the db
                while uid_exists:
                    user.user_id = SetaUserExt.generate_uuid()
                    uid_exists = self.user_uid_exists(user.user_id)
                
                #insert user record
                self.collection.insert_one(user.to_json(), session=session)       
        
                #insert provider records
                self.collection.insert_one(user.authenticated_provider.to_json(), session=session)                
        
                #insert claims
                if len(user.claims) > 0:
                    for claim in user.claims:
                        self.collection.insert_one(claim.to_json(), session=session)
                        
                #insert default system scopes
                if user.system_scopes is not None and len(user.system_scopes) > 0:
                    self.collection.insert_many(user.system_scopes, session=session)

        
        return user
    
    def _get_user_claims_from_db(self, user_id: str) -> list[UserClaim]:
        user_claims = []
        
        cFilter = {"user_id": user_id, "claim_type":{"$exists" : True}}
        claims =  self.collection.find(cFilter)
        
        for claim in claims:
            user_claims.append(UserClaim.from_db_json(claim))
            
        return user_claims    
                
    #-------------------------------------------------------#