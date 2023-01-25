from interface import implements

from injector import inject
from repository.interfaces.config import IDbConfig

from datetime import datetime
import pytz

from repository.models import CommunityModel
from repository.interfaces.communities_broker import ICommunitiesBroker

from infrastructure.constants import (UserRoleConstants, CommunityScopeConstants, CommunityStatusConstants)

class CommunitiesBroker(implements(ICommunitiesBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
       self.db = config.get_db()
       self.collection = self.db["communities"]

    def create(self, model: CommunityModel) -> None:
        '''Create community json objects in mongo db'''
              
        if not self.community_id_exists(model.community_id):
            now = datetime.now(tz=pytz.utc)
              
            with self.db.client.start_session(causal_consistency=True) as session:
                model.created_at = now
                self.collection.insert_one(model.to_json(), session=session)
                
                #insert this user membership
                membership = {"community_id": model.community_id, "user_id": model.creator, "join_date": now, 
                              "role": UserRoleConstants.CommunityManager, "status": CommunityStatusConstants.Active}
                self.collection.insert_one(membership, session=session)
                
                #set user scopes for this community
                scopes = [
                    {"user_id": model.creator, "community_id": model.community_id, "community_scope": CommunityScopeConstants.Edit},
                    {"user_id": model.creator, "community_id": model.community_id, "community_scope": CommunityScopeConstants.SendInvite},
                    {"user_id": model.creator, "community_id": model.community_id, "community_scope": CommunityScopeConstants.ApproveRequest},
                          ]
                user_collection = self.db["users"]
                user_collection.insert_many(scopes, session=session)

    def update(self, model: CommunityModel) -> None:
        '''Update community fields'''
        
        model.modified_at = datetime.now(tz=pytz.utc)
        uq={"$set": model.to_json_update() }
        
        self.collection.update_one(self._filter_community_by_id(model.community_id), uq)
    
    def update_membership(self, id: str, membership: str) -> None:
        '''Create a change request for a community membership'''
        pass

    def get_by_id(self, id: str) -> CommunityModel:
        '''Retrieve community by id'''
        
        if not id:
            return None
        
        dict = self.collection.find_one(self._filter_community_by_id(id))
        return CommunityModel.from_db_json(dict)
    
    def community_id_exists(self, id: str) -> bool:
        '''Check if a community id exists'''
              
        exists_count = self.collection.count_documents(self._filter_community_by_id(id))
        return exists_count > 0
    
    def _filter_community_by_id(self, id: str):
        '''Get filter dict for a community'''
        return {"community_id": id.lower(), "membership": {"$exists" : True}}