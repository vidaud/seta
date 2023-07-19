from interface import implements

from injector import inject
from datetime import datetime
import pytz

from seta_flask_server.repository.interfaces.config import IDbConfig
from seta_flask_server.repository.models import CommunityModel, EntityScope, MembershipModel
from seta_flask_server.repository.interfaces import ICommunitiesBroker

from seta_flask_server.infrastructure.constants import (CommunityRoleConstants, CommunityStatusConstants)
from seta_flask_server.infrastructure.scope_constants import CommunityScopeConstants, ResourceScopeConstants

class CommunitiesBroker(implements(ICommunitiesBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
       self.db = config.get_db()
       self.collection = self.db["communities"]       

    def create(self, model: CommunityModel, scopes: list[dict]) -> None:
        '''Create community json objects in mongo db'''
              
        if not self.community_id_exists(model.community_id):
            now = datetime.now(tz=pytz.utc)
              
            with self.db.client.start_session(causal_consistency=True) as session:
                model.created_at = now
                self.collection.insert_one(model.to_json(), session=session)
                
                #insert this user membership
                membership = MembershipModel(community_id=model.community_id, user_id=model.creator_id, 
                                             role=CommunityRoleConstants.Owner, join_date=now, status=CommunityStatusConstants.Active)
                self.collection.insert_one(membership.to_json(), session=session)
                                
                #set owner scopes for this community
                user_collection = self.db["users"]
                user_collection.insert_many(scopes, session=session)

    def update(self, model: CommunityModel) -> None:
        '''Update community fields'''
        
        model.modified_at = datetime.now(tz=pytz.utc)
        uq={"$set": model.to_json_update() }
        
        self.collection.update_one(self._filter_community_by_id(model.community_id), uq)
        
    def delete(self, id:str) -> None:
        '''Delete all records for community_id'''       
        
        resource_collection = self.db["resources"]
        user_collection = self.db["users"]
        
        #get resources_ids
        ids = resource_collection.find({"community_id": id}, {"resource_id": 1})
        resource_ids = [i["resource_id"] for i in ids]
        
        
        with self.db.client.start_session(causal_consistency=True) as session:
            #delete community scopes      
            csf = {"community_id": id, "community_scope":{"$exists" : True}}
            user_collection.delete_many(csf, session=session)
            #delete resource scopes
            rsf = {"resource_id": {"$in": resource_ids}, "resource_scope":{"$exists" : True}}
            user_collection.delete_many(rsf, session=session)
            
            #delete all resources from resources collection
            resource_collection.delete_many({"resource_id": {"$in": resource_ids}}, session=session)
            
            #delete all entries from communities collection            
            self.collection.delete_many({"community_id": id}, session=session)
            
            
    
    def get_by_id(self, id: str) -> CommunityModel:
        '''Retrieve community by id'''
        
        if not id:
            return None
        
        dict = self.collection.find_one(self._filter_community_by_id(id))
        
        if dict is None:
            return None
        
        model = CommunityModel.from_db_json(dict)
        
        #TODO: get creator details       
        
        return model
    
    def community_id_exists(self, id: str) -> bool:
        '''Check if a community id exists'''
              
        exists_count = self.collection.count_documents(self._filter_community_by_id(id))
        return exists_count > 0
    
    def get_all_by_user_id(self, user_id:str) -> list[CommunityModel]:
        '''Retrieve all communities filtered by user id'''
        
        membership_filter =  {"user_id": user_id, "status": CommunityStatusConstants.Active, "join_date":{"$exists" : True}}        
        ids = self.collection.find(membership_filter, {"community_id": True})
              
        filter = {"community_id": {"$in": [i["community_id"] for i in ids]}, "membership":{"$exists" : True}}
        communities = self.collection.find(filter)
        
        #TODO: get creator details      
        
        return [CommunityModel.from_db_json(c) for c in communities]
    
    def get_all(self) -> list[CommunityModel]:
        '''Retrieve all communities'''
        
        filter = {"membership":{"$exists" : True}}
        communities = self.collection.find(filter)
        
        return [CommunityModel.from_db_json(c) for c in communities]
    
    def get_orphans(self)  -> list[CommunityModel]:
        # get community ids that have an owner assigned
        pipeline = [
            {"$match":{ "community_scope": CommunityScopeConstants.Owner}},
            {"$group" : { "_id" : "$community_id" }}
        ]
        ids = self.db["users"].aggregate(pipeline)

        #get communities that are not in 'ids'
        filter =  {
                    "membership":{"$exists" : True}, 
                    "community_id": {"$not": {"$in": [i["_id"] for i in ids]}}
                }
        communities = self.collection.find(filter)

        return [CommunityModel.from_db_json(c) for c in communities]
        
    
    #------------------------#
    """ Private methods """
    
    def _filter_community_by_id(self, id: str):
        '''Get filter dict for a community'''
        return {"community_id": id.lower(), "membership": {"$exists" : True}}
    
    #------------------------#