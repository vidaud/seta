from interface import implements
from injector import inject
import pytz

from datetime import datetime, timedelta
from pymongo.results import InsertManyResult

from seta_flask_server.repository.interfaces import IDbConfig, IUsersBroker
from .db_user_permissions import UserPermissionsBroker

from seta_flask_server.repository.models import SetaUser, ExternalProvider, UserClaim, SystemScope, UserSession, SessionToken
from seta_flask_server.infrastructure.scope_constants import SystemScopeConstants

class UsersBroker(implements(IUsersBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.config = config
        self.db = config.get_db()
        self.collection = self.db["users"]
    
    #---------------- Public methods ----------------#
    
    def authenticate_user(self, auth_user: SetaUser) -> SetaUser:
        seta_user = self.get_user_by_email(auth_user.email)
        
        if seta_user is not None:
            for p in seta_user.external_providers:
                if p.provider_uid == auth_user.authenticated_provider.provider_uid and p.provider == auth_user.authenticated_provider.provider:
                    seta_user.authenticated_provider = p
                    
            if seta_user.authenticated_provider is None:
                seta_user.authenticated_provider = ExternalProvider(user_id=seta_user.user_id, 
                                     provider_uid=auth_user.authenticated_provider.provider_uid,
                                     provider=auth_user.authenticated_provider.provider,
                                     first_name=auth_user.authenticated_provider.first_name,
                                     last_name=auth_user.authenticated_provider.last_name,
                                     domain=auth_user.authenticated_provider.domain)
                
                self._create_external_provider(seta_user.authenticated_provider)
        else:
            seta_user = self._create_new_user(auth_user)
            
        return seta_user  
    
    def get_user_by_id_and_provider(self, user_id: str, provider_uid: str, provider: str) -> SetaUser:        
        filter = {"user_id": user_id}
        
        user = self.collection.find_one(filter)
        
        if user is None:
            return None
        
        provider = self._get_external_provider(user_id,provider_uid, provider)
                
        if provider is None:
            return None
        
        if user["user_id"] != provider.user_id:
            return None
        
        seta_user = SetaUser.from_db_json(user)
        seta_user.authenticated_provider = provider
        seta_user.claims = self._get_user_claims_from_db(user_id)
        
        return seta_user
        
    
    def get_user_by_id(self, user_id: str) -> SetaUser:
        filter = {"user_id": user_id}
        
        user = self.collection.find_one(filter)
        
        if user is None:
            return None
        
        seta_user = SetaUser.from_db_json(user)
        seta_user.external_providers = self._get_user_providers_from_db(seta_user.user_id)            
        seta_user.claims = self._get_user_claims_from_db(seta_user.user_id)

        permissionsBroker = UserPermissionsBroker(config=self.config)
        seta_user.community_scopes = permissionsBroker.get_all_user_community_scopes(seta_user.user_id)
        seta_user.resource_scopes = permissionsBroker.get_all_user_resource_scopes(seta_user.user_id)
        seta_user.system_scopes = permissionsBroker.get_all_user_system_scopes(seta_user.user_id)
            
        return seta_user
    
    def user_uid_exists(self, user_id: str) -> bool:        
        filter = {"user_id": user_id, "email": {"$exists" : True}}
                
        return self.collection.count_documents(filter, limit = 1) > 0
  
     #-------------Private methods ----------------------#        
    
    
    def _create_new_user(self, user: SetaUser) -> SetaUser:        
        
        with self.db.client.start_session(causal_consistency=True) as session:
                uid_exists = self.user_uid_exists(user.user_id)
                
                #check if the generated id for this new user already exists in the db
                while uid_exists:
                    user.user_id = SetaUser.generate_uuid()
                    uid_exists = self.user_uid_exists(user.user_id)
                
                #inser user record
                self.collection.insert_one(user.to_json(), session=session)       
        
                #insert provider records
                self.collection.insert_one(user.authenticated_provider.to_json(), session=session)                
        
                #insert claims
                if len(user.claims) > 0:
                    for claim in user.claims:
                        self.collection.insert_one(claim.to_json(), session=session)
                        
                #insert default system scopes
                scopes = [
                    SystemScope(user_id=user.user_id, system_scope=SystemScopeConstants.CreateCommunity, area="community").to_json()
                          ]
                self.collection.insert_many(scopes, session=session)

        
        return user     
        
    
    def _create_external_provider(self, provider: ExternalProvider):         
        self.collection.insert_one(provider.to_json())    
    
    def _get_external_provider(self, user_id: str, provider_uid: str, provider: str) -> ExternalProvider:
        pFilter = {"user_id": user_id, "provider_uid": provider_uid, "provider": provider}
        provider = self.collection.find_one(pFilter)
        
        if provider is None:
            return None
        
        return ExternalProvider.from_db_json(provider)
    
    def get_user_by_email(self, email: str) -> SetaUser:
        if not email:
            return None        
        
        '''
        filter = {"email": email}
        #case insesitive search
        collation={
            'locale': 'en', 
            'strength': 2
        }

        user = self.collection.find_one(filter=filter, collation=collation)
        '''
        
        user = self.collection.find_one({"email": email.lower()})
        if user is None:
            return None
        
        seta_user = SetaUser.from_db_json(user)
        seta_user.external_providers = self._get_user_providers_from_db(seta_user.user_id)            
        seta_user.claims = self._get_user_claims_from_db(seta_user.user_id)
            
        return seta_user
    
    def _get_user_providers_from_db(self, user_id: str) -> list[ExternalProvider]:
        user_providers = []
        
        pFilter = {"user_id": user_id, "provider":{"$exists" : True}}
        providers = self.collection.find(pFilter)
        
        for provider in providers:
            user_providers.append(ExternalProvider.from_db_json(provider))
            
        return user_providers
    
    def _get_user_claims_from_db(self, user_id: str) -> list[UserClaim]:
        user_claims = []
        
        cFilter = {"user_id": user_id, "claim_type":{"$exists" : True}}
        claims =  self.collection.find(cFilter)
        
        for claim in claims:
            user_claims.append(UserClaim.from_db_json(claim))
            
        return user_claims    
                
    #-------------------------------------------------------#