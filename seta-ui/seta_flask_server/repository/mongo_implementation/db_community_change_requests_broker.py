# pylint: disable=missing-function-docstring
from datetime import datetime
import pytz
from interface import implements
from injector import inject
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
        """Create community change request json objects in mongo db"""
        now = datetime.now(tz=pytz.utc)

        model.request_id = shortuuid.ShortUUID().random(length=20)
        model.status = RequestStatusConstants.Pending
        model.initiated_date = now

        self.collection.insert_one(model.to_json())

    def update(self, model: CommunityChangeRequestModel) -> None:
        model.review_date = datetime.now(tz=pytz.utc)

        with self.db.client.start_session(causal_consistency=True) as session:
            self.collection.update_one(
                {
                    "community_id": model.community_id,
                    "request_id": model.request_id,
                    "field_name": {"$exists": True},
                },
                {"$set": model.to_json_update()},
                session=session,
            )

            if model.status == RequestStatusConstants.Approved:
                modified_at = datetime.now(tz=pytz.utc)

                self.collection.update_one(
                    {
                        "community_id": model.community_id,
                        "membership": {"$exists": True},
                    },
                    {
                        "$set": {
                            model.field_name: model.new_value,
                            "modified_at": modified_at,
                        }
                    },
                    session=session,
                )

    def get_request(
        self, community_id: str, request_id: str
    ) -> CommunityChangeRequestModel:
        request = self.collection.find_one(
            {
                "community_id": community_id,
                "request_id": request_id,
                "field_name": {"$exists": True},
            }
        )

        if request is not None:
            return CommunityChangeRequestModel.from_db_json(request)

        return None

    def get_all_pending(self) -> list[CommunityChangeRequestModel]:
        requests = self.collection.find(
            {
                "status": RequestStatusConstants.Pending,
                "field_name": {"$exists": True},
            }
        )

        return [CommunityChangeRequestModel.from_db_json(c) for c in requests]

    def get_all_by_user_id(self, user_id: str) -> list[CommunityChangeRequestModel]:
        requests = self.collection.find(
            {"requested_by": user_id, "field_name": {"$exists": True}}
        )

        return [CommunityChangeRequestModel.from_db_json(c) for c in requests]

    def has_pending_field(self, community_id: str, field_name: str) -> bool:
        return (
            self.collection.count_documents(
                {
                    "community_id": community_id,
                    "field_name": field_name,
                    "status": RequestStatusConstants.Pending,
                    "request_id": {"$exists": True},
                }
            )
            > 0
        )

    def get_all_by_community_id(
        self, community_id: str
    ) -> list[CommunityChangeRequestModel]:
        requests = self.collection.find(
            {"community_id": community_id, "field_name": {"$exists": True}}
        )

        return [CommunityChangeRequestModel.from_db_json(c) for c in requests]
