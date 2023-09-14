from interface import implements

from injector import inject
from seta_auth.repository.interfaces import IDbConfig, IResourcesBroker
from seta_auth.infrastructure.constants import (CommunityStatusConstants, ResourceStatusConstants, ResourceTypeConstants)

class ResourcesBroker(implements(IResourcesBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
       self.db = config.get_db()
       self.collection = self.db["resources"]
    
    def get_all_queryable_by_user_id(self, user_id:str) -> list[str]:        
        community_ids = self._get_communities(user_id)
                
        #get active resources
        filter = {"community_id": {"$in": community_ids}, 
                  "status": ResourceStatusConstants.Active, 
                  "type": ResourceTypeConstants.Discoverable
                }        

        profile =  self.db["user-profiles"].find_one({"user_id": user_id, 
                                                     "profile": "unsearchable-resources"}
                                                    )

        if profile and "resources" in profile:            
            filter["resource_id"] = {"$nin": profile["resources"]}

        resources = self.collection.find(filter, {"resource_id": 1})
        #return resource ids
        return [c["resource_id"] for c in resources]
    
    def get_all_by_user_id_and_type(self, user_id:str, type: str) -> list[str]:
        community_ids = self._get_communities(user_id)

        filter = {
                    "community_id": {"$in": community_ids}, 
                    "status": ResourceStatusConstants.Active, 
                    "type": type
                }
        
        resources = self.collection.find(filter, {"resource_id": 1})
        #return resource ids
        return [c["resource_id"] for c in resources]

    def _get_communities(self, user_id:str)  -> list[str]:
         #get active memberships
        community_collection = self.db["communities"]
        
        memberships_filter =  {"user_id": user_id, "status": CommunityStatusConstants.Active, "join_date":{"$exists" : 1}}        
        memberships = community_collection.find(memberships_filter, {"community_id": 1})        
        return [i["community_id"] for i in memberships]