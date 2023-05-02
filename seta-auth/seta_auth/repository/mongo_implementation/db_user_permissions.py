from interface import implements
from seta_auth.repository.interfaces import IDbConfig, IUserPermissionsBroker
from seta_auth.repository.models import EntityScope, SystemScope

from injector import inject

class UserPermissionsBroker(implements(IUserPermissionsBroker)):

    @inject
    def __init__(self, config: IDbConfig) -> None:
       self.db = config.get_db()
       self.collection = self.db["users"]
    

    def get_all_user_system_scopes(self, user_id: str) -> list[SystemScope]:
        '''Return all system scopes assigned to 'user_id' '''

        system_scopes = []
        
        cFilter = {"user_id": user_id, "system_scope":{"$exists" : True}, "area":{"$exists" : True}}
        scopes =  self.collection.find(cFilter)
        
        for scope in scopes:
            system_scopes.append(SystemScope.from_db_json(scope))
            
        return system_scopes

    def get_all_user_resource_scopes(self, user_id: str) -> list[EntityScope]:
        '''Return all resource scopes assigned to 'user_id' '''

        resource_scopes = []
        
        cFilter = {"user_id": user_id, "resource_scope":{"$exists" : True}}
        scopes =  self.collection.find(cFilter)
        
        for scope in scopes:
            resource_scopes.append(EntityScope.resource_from_db_json(scope))
            
        return resource_scopes

    def get_all_user_community_scopes(self, user_id: str) -> list[EntityScope]:
        '''Return all community scopes assigned to 'user_id' '''

        community_scopes = []
        
        cFilter = {"user_id": user_id, "community_scope":{"$exists" : True}}
        scopes =  self.collection.find(cFilter)
        
        for scope in scopes:
            community_scopes.append(EntityScope.community_from_db_json(scope))
            
        return community_scopes