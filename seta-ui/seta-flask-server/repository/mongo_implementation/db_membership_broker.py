from interface import implements

from injector import inject
from repository.interfaces.config import IDbConfig

from datetime import datetime
import pytz

from repository.models import MembershipModel, MembershipRequestModel
from repository.interfaces import IMembershipsBroker

from infrastructure.constants import RequestStatusConstants, CommunityRoleConstants, CommunityStatusConstants

class MembershipsBroker(implements(IMembershipsBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
       self.db = config.get_db()
       self.collection = self.db["communities"]
    
    def create_membership(self, model: MembershipModel) -> None:
        '''Create community membership json objects in mongo db'''
        
        if not self.membership_exists(user_id=model.user_id, community_id=model.community_id):

            if model.join_date is None:
                now = datetime.now(tz=pytz.utc)
                model.join_date = now
            if model.role is None:
                model.role = CommunityRoleConstants.Member
            if model.status is None:
                model.status = CommunityStatusConstants.Active            
            
            self.collection.insert_one(model.to_json())

    def update_membership(self, model: MembershipModel) -> None:
        '''Update membership fields'''
        
        model.modified_at = datetime.now(tz=pytz.utc)
        uq={"$set": model.to_json_update() }
        
        self.collection.update_one(self._filter_membership(model.community_id, model.user_id), uq)
    
    def delete_membership(self, community_id: str, user_id: str) -> None:
        self.collection.delete_one(self._filter_membership(community_id, user_id))
    
    def get_membership(self, community_id: str, user_id: str) -> MembershipModel:        
        dict = self.collection.find_one(self._filter_membership(community_id, user_id))
        
        if dict is None:
            return None
        
        model = MembershipModel.from_db_json(dict)        
        return model
    
    def get_memberships_by_community_id(self, community_id: str) -> list[MembershipModel]:
        filter =  {"community_id": community_id, "join_date":{"$exists" : True}}
        memberships = self.collection.find(filter)
        
        return [MembershipModel.from_db_json(c) for c in memberships]
    
    def get_memberships_by_user_id(self, user_id: str) -> list[MembershipModel]:
        filter =  {"user_id": user_id, "join_date":{"$exists" : True}}
        memberships = self.collection.find(filter)
        
        return [MembershipModel.from_db_json(c) for c in memberships]
    
    def membership_exists(self, community_id: str, user_id: str) -> bool:
        filter = {"community_id": community_id.lower(), "user_id": user_id, "join_date": {"$exists" : True}}
        
        exists_count = self.collection.count_documents(filter)
        return exists_count > 0
    
    def create_request(self, model: MembershipRequestModel) -> None:
        '''Create a request for a community membership'''
        
        if self.membership_exists(user_id=model.requested_by, community_id=model.community_id):
            return None
        
        if self.request_exists(community_id=model.community_id, user_id=model.requested_by):
            return None
                
        now = datetime.now(tz=pytz.utc)
        model.initiated_date = now
        model.status = RequestStatusConstants.Pending
                            
        self.collection.insert_one(model.to_json())

    def update_request(self, model: MembershipRequestModel) -> None:
        '''Update request'''
        
        now = datetime.now(tz=pytz.utc)
        model.review_date = datetime.now(tz=pytz.utc)
        uq={"$set": model.to_json_update() }

        with self.db.client.start_session(causal_consistency=True) as session:        
            self.collection.update_one(self._filter_request(model.community_id, model.requested_by), uq, session=session)

            if model.status == RequestStatusConstants.Approved:
                #create membership
                membership = MembershipModel(community_id=model.community_id, user_id=model.requested_by, join_date=now, 
                                             role=CommunityRoleConstants.Member, status=CommunityStatusConstants.Active)

                if not self.membership_exists(user_id=model.requested_by, community_id=model.community_id):
                    self.collection.insert_one(membership.to_json(), session = session)
    
    def get_requests_by_community_id(self, community_id: str) -> list[MembershipRequestModel]:
        filter =  {"community_id": community_id, "message":{"$exists" : True}}
        requests = self.collection.find(filter)
        
        return [MembershipRequestModel.from_db_json(c) for c in requests]
    
    def get_request(self, community_id: str, user_id: str) -> MembershipRequestModel:
        filter =  {"community_id": community_id, "requested_by": user_id, "message":{"$exists" : True}}
        request = self.collection.find_one(filter)
        
        if request is None:
            return None
        
        return MembershipRequestModel.from_db_json(request)
    
    def get_requests_by_user_id(self, user_id: str) -> list[MembershipRequestModel]:
        filter =  {"requested_by": user_id, "message":{"$exists" : True}}
        requests = self.collection.find(filter)
        
        return [MembershipRequestModel.from_db_json(c) for c in requests]
    
    def request_exists(self, community_id: str,  user_id: str) -> bool:    
        filter =  self._filter_request(community_id=community_id, user_id=user_id)
        
        print(f"Request filter: '{filter}'")
        
        exists_count = self.collection.count_documents(filter)
        return exists_count > 0
    
    #-----------------------------------------#
    """Private methods"""
    
    def _filter_membership(self, community_id: str, user_id: str):
        '''Get filter dict for a membership'''
        return {"community_id": community_id.lower(), "user_id": user_id, "join_date": {"$exists" : True}}
    
    def _filter_request(self, community_id: str, user_id: str):
        '''Get filter dict for a membership'''
        return {"community_id": community_id.lower(), "requested_by": user_id, "message":{"$exists" : True}}
    
   
    
    #-----------------------------------------#