# pylint: disable=missing-function-docstring
from datetime import datetime
import json
import pytz
from interface import implements
from injector import inject
import shortuuid

from seta_flask_server.repository.interfaces.config import IDbConfig
from seta_flask_server.repository.interfaces.resources_broker import (
    IResourceChangeRequestsBroker,
)
from seta_flask_server.repository.models import ResourceChangeRequestModel
from seta_flask_server.infrastructure.constants import (
    RequestStatusConstants,
    ResourceRequestFieldConstants,
)


class ResourceChangeRequestsBroker(implements(IResourceChangeRequestsBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.db = config.get_db()
        self.collection = self.db["resources"]

    def create(self, model: ResourceChangeRequestModel) -> None:
        now = datetime.now(tz=pytz.utc)

        model.request_id = ResourceChangeRequestsBroker.generate_uuid()
        model.status = RequestStatusConstants.Pending
        model.initiated_date = now

        self.collection.insert_one(model.to_json())

    def update(self, model: ResourceChangeRequestModel) -> None:
        model.review_date = datetime.now(tz=pytz.utc)

        with self.db.client.start_session(causal_consistency=True) as session:
            self.collection.update_one(
                {"resource_id": model.resource_id, "request_id": model.request_id},
                {"$set": model.to_json_update()},
                session=session,
            )

            if model.status == RequestStatusConstants.Approved:
                cf = {
                    "resource_id": model.resource_id,
                    "community_id": {"$exists": True},
                }
                modified_at = datetime.now(tz=pytz.utc)

                new_value = model.new_value

                if model.field_name == ResourceRequestFieldConstants.Limits:
                    # new value is stored as json string, get dict for update
                    new_value = json.loads(new_value)

                uq = {"$set": {model.field_name: new_value, "modified_at": modified_at}}
                self.collection.update_one(cf, uq, session=session)

    def get_request(
        self, resource_id: str, request_id: str
    ) -> ResourceChangeRequestModel:
        request = self.collection.find_one(
            {"resource_id": resource_id, "request_id": request_id}
        )

        if request is None:
            return None

        return ResourceChangeRequestModel.from_db_json(request)

    def get_all_pending(self) -> list[ResourceChangeRequestModel]:
        requests = self.collection.find(
            {
                "status": RequestStatusConstants.Pending,
                "request_id": {"$exists": True},
            }
        )

        return [ResourceChangeRequestModel.from_db_json(c) for c in requests]

    def has_pending_field(self, resource_id: str, field_name: str) -> bool:
        exists_count = self.collection.count_documents(
            {
                "resource_id": resource_id,
                "field_name": field_name,
                "status": RequestStatusConstants.Pending,
                "request_id": {"$exists": True},
            }
        )

        return exists_count > 0

    def get_all_by_user_id(self, user_id: str) -> list[ResourceChangeRequestModel]:
        requests = self.collection.find(
            {"requested_by": user_id, "request_id": {"$exists": True}}
        )

        return [ResourceChangeRequestModel.from_db_json(c) for c in requests]

    def get_all_by_resource_id(
        self, resource_id: str
    ) -> list[ResourceChangeRequestModel]:
        requests = self.collection.find(
            {"resource_id": resource_id, "request_id": {"$exists": True}}
        )

        return [ResourceChangeRequestModel.from_db_json(c) for c in requests]

    def get_all_by_community_id(
        self, community_id: str
    ) -> list[ResourceChangeRequestModel]:
        # get resources_ids
        ids = self.collection.find({"community_id": community_id}, {"resource_id": 1})
        resource_ids = [i["resource_id"] for i in ids]

        requests = self.collection.find(
            {"resource_id": {"$in": resource_ids}, "request_id": {"$exists": True}}
        )

        return [ResourceChangeRequestModel.from_db_json(c) for c in requests]

    @staticmethod
    def generate_uuid() -> str:
        return shortuuid.ShortUUID().random(length=20)
