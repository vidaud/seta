from interface import implements

from injector import inject
from seta_flask_server.repository.interfaces.config import IDbConfig

from datetime import datetime
import pytz
import shortuuid
import json

from seta_flask_server.repository.interfaces.resources_broker import IResourceChangeRequestsBroker
from seta_flask_server.repository.models import ResourceChangeRequestModel

from seta_flask_server.infrastructure.constants import RequestStatusConstants, ResourceRequestFieldConstants

class ResourceChangeRequestsBroker(implements(IResourceChangeRequestsBroker)):

    @inject
    def __init__(self, config: IDbConfig) -> None:
       self.db = config.get_db()
       self.collection = self.db["resources"]

    def create(self, model: ResourceChangeRequestModel) -> None:
        '''Create resouce change request json objects in mongo db'''

        now = datetime.now(tz=pytz.utc)
        
        model.request_id = ResourceChangeRequestsBroker.generate_uuid()
        model.status = RequestStatusConstants.Pending
        model.initiated_date = now
        
        self.collection.insert_one(model.to_json())

    def update(self, model: ResourceChangeRequestModel) -> None:
        '''Update change request; update resource field if approved'''
        
        model.review_date = datetime.now(tz=pytz.utc)
        
        filter={"resource_id": model.resource_id, "request_id": model.request_id}
        uq={"$set": model.to_json_update() }
        
        with self.db.client.start_session(causal_consistency=True) as session:
            self.collection.update_one(filter, uq, session=session)
            
            if model.status == RequestStatusConstants.Approved:
                cf={"resource_id": model.resource_id, "access": {"$exists" : True}}
                modified_at = datetime.now(tz=pytz.utc)
                
                new_value = model.new_value

                if model.field_name == ResourceRequestFieldConstants.Limits:
                    #new value is stored as json string, get dict for update
                    new_value = json.loads(new_value)

                uq={"$set": {model.field_name: new_value, "modified_at": modified_at} }            
                self.collection.update_one(cf, uq, session=session)
    
    def get_request(self, resource_id: str, request_id: str) -> ResourceChangeRequestModel:
        '''Get request'''

        filter =  {"resource_id": resource_id, "request_id": request_id}
        request = self.collection.find_one(filter)
        
        if request is None:
            return None
        
        return ResourceChangeRequestModel.from_db_json(request)
    
    def get_all_pending(self) -> list[ResourceChangeRequestModel]:
        '''Get all pending change requests for resources'''

        filter =  {"status": RequestStatusConstants.Pending, "request_id": {"$exists" : True}}
        requests = self.collection.find(filter)
        
        return [ResourceChangeRequestModel.from_db_json(c) for c in requests]
    
    def has_pending_field(self, resource_id: str, filed_name: str) -> bool:
        '''Check if there's another pending request for the same field'''

        filter={"resource_id": resource_id, "field_name": filed_name, "status": RequestStatusConstants.Pending, "request_id": {"$exists" : True}}
        exists_count = self.collection.count_documents(filter)
        
        return exists_count > 0
    
    def get_all_by_user_id(self, user_id:str) -> list[ResourceChangeRequestModel]:
        '''Get all requests initiated by user_id'''

        filter =  {"requested_by": user_id, "request_id": {"$exists" : True}}
        requests = self.collection.find(filter)
        
        return [ResourceChangeRequestModel.from_db_json(c) for c in requests]    

    @staticmethod
    def generate_uuid() -> str:
        return shortuuid.ShortUUID().random(length=20)