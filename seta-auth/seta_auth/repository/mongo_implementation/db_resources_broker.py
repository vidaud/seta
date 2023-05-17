from interface import implements

from injector import inject
from seta_auth.repository.interfaces import IDbConfig, IResourcesBroker
from seta_auth.infrastructure.constants import (CommunityStatusConstants, ResourceStatusConstants)

class ResourcesBroker(implements(IResourcesBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
       self.db = config.get_db()
       self.collection = self.db["resources"]
    
    def get_all_queryable_by_user_id(self, user_id:str) -> list[str]:
        '''Retrieve all resources that can be queried by user id'''
        
        #get active memberships
        community_collection = self.db["communities"]
        
        memberships_filter =  {"user_id": user_id, "status": CommunityStatusConstants.Active, "join_date":{"$exists" : 1}}        
        memberships = community_collection.find(memberships_filter, {"community_id": 1})        
        community_ids = [i["community_id"] for i in memberships]
                
        #get active resources
        filter = {"community_id": {"$in": community_ids}, "status": ResourceStatusConstants.Active}        
        resources = self.collection.find(filter)
        
        #return resource ids
        return [c["resource_id"] for c in resources]