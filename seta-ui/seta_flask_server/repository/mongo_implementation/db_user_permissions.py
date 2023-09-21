from interface import implements
from seta_flask_server.repository.interfaces import IDbConfig, IUserPermissionsBroker
from seta_flask_server.repository.models import EntityScope, SystemScope

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

    def get_user_community_scopes_by_id(self, user_id: str, community_id: str) -> list[EntityScope]:
        '''Return 'community_id' scopes assigned to 'user_id' '''

        community_scopes = []
        
        cFilter = {"user_id": user_id, "community_id": community_id, "community_scope":{"$exists" : True}}
        scopes =  self.collection.find(cFilter)
        
        for scope in scopes:
            community_scopes.append(EntityScope.community_from_db_json(scope))
            
        return community_scopes

    def get_user_resource_scopes_by_id(self, user_id: str, resource_id: str) -> list[EntityScope]:
        '''Return 'resource_id' scopes assigned to 'user_id' '''

        resource_scopes = []
        
        cFilter = {"user_id": user_id, "resource_id": resource_id, "resource_scope":{"$exists" : True}}
        scopes =  self.collection.find(cFilter)
        
        for scope in scopes:
            resource_scopes.append(EntityScope.resource_from_db_json(scope))
            
        return resource_scopes   

    def replace_all_user_system_scopes(self, user_id: str, scopes: list[SystemScope]) -> None:
        ''' Replace all system scopes for 'user_id' '''

        cFilter = {"user_id": user_id, "system_scope":{"$exists" : True}}
        sList = [s.to_json() for s in scopes]
        
        with self.db.client.start_session(causal_consistency=True) as session:
            #delete existing system scopes
            self.collection.delete_many(cFilter, session=session)  
            #insert new scopes          
            if len(sList) > 0:
                self.collection.insert_many(sList, session=session)

    def replace_all_user_community_scopes(self, user_id: str, community_id: str, scopes: list[str]) -> None:
        ''' Replace all community scopes for 'user_id' and 'community_id' '''

        cFilter = {"user_id": user_id, "community_id": community_id, "community_scope":{"$exists" : True}}
                
        sList = []
        if scopes:
            for scope in scopes:
                es = EntityScope(user_id=user_id, id = community_id, scope=scope)
                sList.append(es.to_community_json())

        with self.db.client.start_session(causal_consistency=True) as session:
            #delete existing system scopes
            self.collection.delete_many(cFilter, session=session)
            
            if len(sList) > 0:
                #insert new scopes
                self.collection.insert_many(sList, session=session)

    def replace_all_user_resource_scopes(self, user_id: str, resource_id: str, scopes: list[str]) -> None:
        ''' Replace all resource scopes for 'user_id' and 'resource_id' '''

        cFilter = {"user_id": user_id, "resource_id": resource_id, "resource_scope":{"$exists" : True}}

        sList = []
        if scopes:
            for scope in scopes:
                es = EntityScope(user_id=user_id, id = resource_id, scope=scope)
                sList.append(es.to_resource_json())
        
        with self.db.client.start_session(causal_consistency=True) as session:
            #delete existing system scopes
            self.collection.delete_many(cFilter, session=session)
            
            if len(sList) > 0:
                #insert new scopes
                self.collection.insert_many(sList, session=session)

    def get_all_resource_scopes(self, resource_id: str) -> list[EntityScope]:
        '''Return all resource scopes for resource id '''

        resource_scopes = []
        
        cFilter = {"resource_id": resource_id, "resource_scope":{"$exists" : True}}
        scopes =  self.collection.find(cFilter)
        
        for scope in scopes:
            resource_scopes.append(EntityScope.resource_from_db_json(scope))
            
        return resource_scopes

    def get_all_community_scopes(self, community_id: str) -> list[EntityScope]:
        '''Return all community scopes for community id '''

        community_scopes = []
        
        cFilter = {"community_id": community_id, "community_scope":{"$exists" : True}}
        scopes =  self.collection.find(cFilter)
        
        for scope in scopes:
            community_scopes.append(EntityScope.community_from_db_json(scope))
            
        return community_scopes