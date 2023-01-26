from interface import implements

from injector import inject
from repository.interfaces.config import IDbConfig

from datetime import datetime
import pytz

from repository.models import MembershipModel, MembershipRequestModel
from repository.interfaces import IMembershipsBroker

class MembershipsBroker(implements(IMembershipsBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
       self.db = config.get_db()
       self.collection = self.db["communities"]
    
    def create_membership(self, model: MembershipModel) -> None:
        '''Create community membership json objects in mongo db'''
        
        if not self.membership_exists(model.user_id, model.community_id):
            now = datetime.now(tz=pytz.utc)
            model.join_date = now
            
            self.collection.insert_one(model.to_json())

    def update_membership(self, model: MembershipModel) -> None:
        pass
    
    def get_memberships_by_community_id(self, community_id: str) -> list[MembershipModel]:
        pass
    
    def get_memberships_by_user_id(self, user_id: str) -> list[MembershipModel]:
        pass
    
    def create_request(self, model: MembershipRequestModel) -> None:
        '''Create a request for a community membership'''
        mbroker = MembershipsBroker()
        
        if not mbroker.membership_exists(model.requested_by, model.community_id):        
            if not self._request_exists(model.requested_by, model.community_id):            
                self.collection.insert_one(model.to_json())

    def update_request(self, model: MembershipRequestModel) -> None:
        pass
    
    def get_requests_by_community_id(self, community_id: str) -> list[MembershipRequestModel]:
        pass
    
    def get_requests_by_user_id(self, user_id: str) -> list[MembershipRequestModel]:
        pass
    
    #-----------------------------------------#
    """Private methods"""
    
    def _membership_exists(self, user_id: str, community_id: str) -> bool:
        filter = {"community_id": community_id.lower(), "user_id": user_id.lower(), "join_date": {"$exists" : True}}
        
        exists_count = self.collection.count_documents(filter)
        return exists_count > 0
    
    def _request_exists(self, user_id: str, community_id: str) -> bool:
        filter = {"community_id": community_id.lower(), "requested_by": user_id.lower()}
        
        exists_count = self.collection.count_documents(filter)
        return exists_count > 0
    
    #-----------------------------------------#