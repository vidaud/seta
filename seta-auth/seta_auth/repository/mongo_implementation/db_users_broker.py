from interface import implements
from injector import inject

from seta_auth.repository.interfaces import IDbConfig, IUsersBroker
from seta_auth.repository.models import SetaUser, ExternalProvider, UserClaim
from seta_auth.repository.mongo_implementation.db_user_permissions import UserPermissionsBroker

class UsersBroker(implements(IUsersBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.config = config
        self.db = config.get_db()
        self.collection = self.db["users"]
    
    #---------------- Public methods ----------------#   
    
    
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

    #-------------------------------------------------------#  
    
    #---------------- Private methods ----------------#        
            
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