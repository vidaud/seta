from interface import implements

from injector import inject
from seta_flask_server.repository.interfaces.config import IDbConfig

from datetime import datetime
import pytz

from seta_flask_server.repository.interfaces.resources_broker import IResourcesBroker
from seta_flask_server.repository.models import ResourceModel, ResourceLimitsModel, EntityScope

from seta_flask_server.infrastructure.constants import (ResourceStatusConstants, CommunityStatusConstants)

class ResourcesBroker(implements(IResourcesBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
       self.db = config.get_db()
       self.collection = self.db["resources"]

    def create(self, model: ResourceModel, scopes: list[dict]) -> None:
        '''Create resource json objects in mongo db'''

        if not self.resource_id_exists(model.resource_id):
            now = datetime.now(tz=pytz.utc)

            with self.db.client.start_session(causal_consistency=True) as session:
                model.status = ResourceStatusConstants.Active
                #keep default limits
                model.limits = ResourceLimitsModel()

                model.created_at = now

                model_json = model.to_json()
                self.collection.insert_one(model_json, session=session)
               
                user_collection = self.db["users"]
                user_collection.insert_many(scopes, session=session)


    def update(self, model: ResourceModel) -> None:
        '''Update resource fields'''

        model.modified_at = datetime.now(tz=pytz.utc)
        uq={"$set": model.to_json_update() }
        
        self.collection.update_one(self._filter_resource_by_id(model.resource_id), uq)

    def delete(self, id: str) -> None:
        '''Delete all records for resource id'''

        user_collection = self.db["users"]
        with self.db.client.start_session(causal_consistency=True) as session:
            #delete resource scopes
            rsf = {"resource_id": id, "resource_scope":{"$exists" : True}}
            user_collection.delete_many(rsf, session=session)

            #delete all entries from resources collection            
            self.collection.delete_many({"resource_id": id}, session=session)

    def get_by_id(self, id: str) -> ResourceModel:
        '''Retrieve resource by id'''

        dict = self.collection.find_one(self._filter_resource_by_id(id))
        
        if dict is None:
            return None
        
        model = ResourceModel.from_db_json(dict)        
        return model

    def get_all_assigned_to_user_id(self, user_id:str) -> list[ResourceModel]:
        '''Retrieve all resources assigned to user id'''

        user_collection = self.db["users"]
        rsf = {"user_id": user_id, "resource_scope":{"$exists" : True}}

        ids = user_collection.find(rsf, {"resource_id": True})
        resource_ids = [i["resource_id"] for i in ids]

        filter = {"resource_id": {"$in": resource_ids}, "community_id":{"$exists" : True}}
        resources = self.collection.find(filter)

        return [ResourceModel.from_db_json(c) for c in resources]
    
    def get_all_queryable_by_user_id(self, user_id:str) -> list[ResourceModel]:
        '''Retrieve all resources that can be queried by user id'''
        
        #get active memberships
        community_collection = self.db["communities"]
        
        memberships_filter =  {"user_id": user_id, "status": CommunityStatusConstants.Active, "join_date":{"$exists" : 1}}        
        memberships = community_collection.find(memberships_filter, {"community_id": 1})        
        community_ids = [i["community_id"] for i in memberships]
                
        #get active resources
        filter = {"community_id": {"$in": community_ids}, "status": ResourceStatusConstants.Active, "community_id":{"$exists" : 1}}        
        resources = self.collection.find(filter)
        
        return [ResourceModel.from_db_json(c) for c in resources]

    def get_all_by_community_id(self, community_id:str) -> list[ResourceModel]:
        '''Retrieve all resources belonging to the community id'''

        filter = {"community_id": community_id}
        resources = self.collection.find(filter)

        return [ResourceModel.from_db_json(c) for c in resources]

    def resource_id_exists(self, id: str) -> bool:
        '''Check if a resouce id exists'''
              
        exists_count = self.collection.count_documents(self._filter_resource_by_id(id))
        return exists_count > 0
    
    def get_all(self) -> list[ResourceModel]:
        filter = {"community_id": {"$exists" : True}}
        resources = self.collection.find(filter)

        return [ResourceModel.from_db_json(c) for c in resources]

    #------------------------#
    """ Private methods """
    
    def _filter_resource_by_id(self, id: str):
        '''Get filter dict for a resource'''
        return {"resource_id": id, "community_id": {"$exists" : True}}
    
    #------------------------#