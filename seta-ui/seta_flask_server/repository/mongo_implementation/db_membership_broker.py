from interface import implements

from injector import inject

from datetime import datetime
import pytz

from seta_flask_server.repository.models import MembershipModel, MembershipRequestModel
from seta_flask_server.repository.interfaces import IDbConfig, IMembershipsBroker

from seta_flask_server.infrastructure.constants import RequestStatusConstants, CommunityRoleConstants, CommunityStatusConstants

class MembershipsBroker(implements(IMembershipsBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
       self.db = config.get_db()
       self.collection = self.db["communities"]
       self.request_collection = self.db["communities"]
       self.user_collection = self.db["users"]
    
    def create_membership(self, model: MembershipModel, community_scopes: list[dict] = None) -> None:
        '''Create community membership json objects in mongo db'''
        
        if not self.membership_exists(user_id=model.user_id, community_id=model.community_id):

            if model.join_date is None:
                now = datetime.now(tz=pytz.utc)
                model.join_date = now
            if model.role is None:
                model.role = CommunityRoleConstants.Member
            if model.status is None:
                model.status = CommunityStatusConstants.Active            
            
            with self.db.client.start_session(causal_consistency=True) as session:
                self.collection.insert_one(model.to_json())

                if community_scopes is not None and len(community_scopes) > 0:
                    self.user_collection.insert_many(community_scopes, session=session)

    def update_membership(self, model: MembershipModel) -> None:
        '''Update membership fields'''
        
        model.modified_at = datetime.now(tz=pytz.utc)
        uq={"$set": model.to_json_update() }
        
        self.collection.update_one(self._filter_membership(model.community_id, model.user_id), uq)
    
    def delete_membership(self, community_id: str, user_id: str) -> None:
        resource_collection = self.db["resources"]

        #get resources_ids
        ids = resource_collection.find({"community_id": community_id}, {"resource_id": 1})
        resource_ids = [i["resource_id"] for i in ids]

        with self.db.client.start_session(causal_consistency=True) as session:
            #delete membership
            self.collection.delete_one(self._filter_membership(community_id, user_id))

            #delete community scopes      
            csf = {"community_id": community_id, "user_id": user_id, "community_scope":{"$exists" : True}}
            self.user_collection.delete_many(csf, session=session)

            #delete resource scopes
            rsf = {"user_id": user_id, "resource_id": {"$in": resource_ids}, "resource_scope":{"$exists" : True}}
            self.user_collection.delete_many(rsf, session=session)
    
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
        filter = {"community_id": community_id, "user_id": user_id, "join_date": {"$exists" : True}}
        
        exists_count = self.collection.count_documents(filter)
        return exists_count > 0
    
    ### start-region Requests ###
    def create_request(self, model: MembershipRequestModel) -> bool:
        '''Create a request for a community membership'''
        
        if self.membership_exists(user_id=model.requested_by, community_id=model.community_id):
            return False
        
        now = datetime.now(tz=pytz.utc)
        
        request = self.get_request(user_id=model.requested_by, community_id=model.community_id)

        if request is not None:
            #check if the rejected request expired or approved
            if ((request.status == RequestStatusConstants.Approved) or 
                (request.status == RequestStatusConstants.Rejected and request.reject_timeout < now)):
                #delete membership
                self.collection.delete_one(self._filter_request(user_id=model.requested_by, community_id=model.community_id))
            else:
                return False                
        
        model.initiated_date = now
        model.status = RequestStatusConstants.Pending
                            
        self.request_collection.insert_one(model.to_json())
        return True

    def approve_request(self, model: MembershipRequestModel, community_scopes: list[dict]) -> None:
        '''Update request'''
        
        model.status = RequestStatusConstants.Approved
        now = datetime.now(tz=pytz.utc)
        model.review_date = datetime.now(tz=pytz.utc)
        uq={"$set": model.to_json_update() }

        self.request_collection.update_one(self._filter_request(model.community_id, model.requested_by), uq)
            
        #create membership
        membership = MembershipModel(community_id=model.community_id, user_id=model.requested_by, join_date=now, 
                                        role=CommunityRoleConstants.Member, status=CommunityStatusConstants.Active)
        
        self.create_membership(model = membership, community_scopes= community_scopes)

    def reject_request(self, model: MembershipRequestModel) -> None:
        '''Update request'''
        
        model.status = RequestStatusConstants.Rejected        
        model.review_date = datetime.now(tz=pytz.utc)
        uq={"$set": model.to_json_update() }        
        
        self.request_collection.update_one(self._filter_request(model.community_id, model.requested_by), uq)
    
    def get_requests_by_community_id(self, community_id: str, status: str = None) -> list[MembershipRequestModel]:
        filter =  {"community_id": community_id, "requested_by": {"$exists" : True}, "field_name": {"$exists" : False}}

        if status:
            filter["status"] = status

        requests = self.request_collection.find(filter)
        
        return [MembershipRequestModel.from_db_json(c) for c in requests]
    
    def get_request(self, community_id: str, user_id: str) -> MembershipRequestModel:
        filter =  self._filter_request(community_id=community_id, user_id=user_id)
        request = self.request_collection.find_one(filter)
        
        if request is None:
            return None
        
        return MembershipRequestModel.from_db_json(request)
    
    def get_requests_by_user_id(self, user_id: str) -> list[MembershipRequestModel]:
        filter =  {"requested_by": user_id, "field_name": {"$exists" : False}}
        requests = self.request_collection.find(filter)
        
        return [MembershipRequestModel.from_db_json(c) for c in requests]
    
    def request_exists(self, community_id: str,  user_id: str) -> bool:    
        filter =  self._filter_request(community_id=community_id, user_id=user_id)
                
        exists_count = self.request_collection.count_documents(filter)
        return exists_count > 0
    
    ### end-region Requests ###

    #-----------------------------------------#
    """Private methods"""
    
    def _filter_membership(self, community_id: str, user_id: str):
        '''Get filter dict for a membership'''
        return {"community_id": community_id, "user_id": user_id, "join_date": {"$exists" : True}}
    
    def _filter_request(self, community_id: str, user_id: str):
        '''Get filter dict for a membership'''
        return {"community_id": community_id, "requested_by": user_id, "field_name": {"$exists" : False}}
    
   
    
    #-----------------------------------------#