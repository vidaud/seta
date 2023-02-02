from interface import implements

from injector import inject
from repository.interfaces.config import IDbConfig

from datetime import datetime
import pytz

from repository.interfaces.resources_broker import IResourceContributorsBroker
from repository.models import ResourceContributorModel

class ResourceContributorsBroker(implements(IResourceContributorsBroker)):

    @inject
    def __init__(self, config: IDbConfig) -> None:
       self.db = config.get_db()
       self.collection = self.db["resources"]

    def create(self, model: ResourceContributorModel):
        '''Create resource_contributor json'''

        if model.uploaded_at is None:
            model.uploaded_at = datetime.now(tz=pytz.utc)

        self.collection.insert_one(model.to_json())

    def get_all_by_resource_id(self, resource_id:str) -> ResourceContributorModel:
        '''Get all contributors for the resource_id'''

        filter = {"resource_id": resource_id, "upload_at": {"$exists": True}}
        contributors = self.collection.find(filter)

        return [ResourceContributorModel.from_db_json(c) for c in contributors]