from interface import implements

from injector import inject

from datetime import datetime
import pytz
import shortuuid

from seta_flask_server.repository.interfaces.config import IDbConfig
from seta_flask_server.repository.models import CommunityChangeRequestModel
from seta_flask_server.repository.interfaces import ICommunityChangeRequestsBroker

from seta_flask_server.infrastructure.constants import RequestStatusConstants

class CommunityChangeRequestsBroker(implements(ICommunityChangeRequestsBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
       self.db = config.get_db()
       self.collection = self.db["communities"]
       
    def create(self, model: CommunityChangeRequestModel) -> None:
        '''Create community change request json objects in mongo db'''
        now = datetime.now(tz=pytz.utc)
        
        model.request_id = CommunityChangeRequestsBroker.generate_uuid()
        model.status = RequestStatusConstants.Pending
        model.initiated_date = now
        
        self.collection.insert_one(model.to_json())

    def update(self, model: CommunityChangeRequestModel) -> None:
        '''Update change request'''
        
        model.review_date = datetime.now(tz=pytz.utc)
        
        filter={"community_id": model.community_id, "request_id": model.request_id}
        uq={"$set": model.to_json_update() }
        
        with self.db.client.start_session(causal_consistency=True) as session:
            self.collection.update_one(filter, uq, session=session)
            
            if model.status == RequestStatusConstants.Approved:
                cf={"community_id": model.community_id, "membership": {"$exists" : True}}
                modified_at = datetime.now(tz=pytz.utc)
                
                uq={"$set": {model.field_name: model.new_value, "modified_at": modified_at} }
            
                self.collection.update_one(cf, uq, session=session)
        
    def get_request(self, community_id: str, request_id: str) -> CommunityChangeRequestModel:
        filter =  {"community_id": community_id, "request_id": request_id}
        request = self.collection.find_one(filter)
        
        if request is None:
            return None
        
        return CommunityChangeRequestModel.from_db_json(request)
    
    def get_all_pending(self) -> list[CommunityChangeRequestModel]:
        filter =  {"status": RequestStatusConstants.Pending, "request_id": {"$exists" : True}}
        requests = self.collection.find(filter)
        
        return [CommunityChangeRequestModel.from_db_json(c) for c in requests]
    
    def get_all_by_user_id(self, user_id:str) -> list[CommunityChangeRequestModel]:
        filter =  {"requested_by": user_id, "request_id": {"$exists" : True}}
        requests = self.collection.find(filter)
        
        return [CommunityChangeRequestModel.from_db_json(c) for c in requests]
    
    def has_pending_field(self, community_id: str, field_name: str) -> bool:
        filter={"community_id": community_id, "field_name": field_name, "status": RequestStatusConstants.Pending, "request_id": {"$exists" : True}}
        exists_count = self.collection.count_documents(filter)
        
        return exists_count > 0
    
    def get_all_by_community_id(self, community_id: str) -> list[CommunityChangeRequestModel]:
        filter =  {"community_id": community_id, "request_id": {"$exists" : True}}
        requests = self.collection.find(filter)
        
        return [CommunityChangeRequestModel.from_db_json(c) for c in requests]
    
    @staticmethod
    def generate_uuid() -> str:
        return shortuuid.ShortUUID().random(length=20)       

