# pylint: disable=missing-function-docstring
from datetime import datetime
import pytz
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces.config import IDbConfig
from seta_flask_server.repository.interfaces import INotificationsBroker
from seta_flask_server.infrastructure.constants import (
    InviteStatusConstants,
    RequestStatusConstants,
)
from seta_flask_server.infrastructure.scope_constants import CommunityScopeConstants


class NotificationsBroker(implements(INotificationsBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> bool:
        self.config = config

        self.db = config.get_db()

    def count_pending_invites(self, user_id: str) -> int:
        collection = self.db["communities"]
        now = datetime.now(tz=pytz.utc)

        return collection.count_documents(
            {
                "invited_user": user_id,
                "status": InviteStatusConstants.Pending,
                "expire_date": {"$gte": now},
                "invite_id": {"$exists": True},
            }
        )

    def count_membership_requests(self, user_id: str) -> int:
        result = self.db["users"].find(
            {
                "user_id": user_id,
                "community_scope": {
                    "$in": [
                        CommunityScopeConstants.Owner,
                        CommunityScopeConstants.Manager,
                    ]
                },
            },
            {"community_id": 1},
        )
        community_ids = [i["community_id"] for i in result]

        if not community_ids:
            return 0

        return self.db["communities"].count_documents(
            {
                "community_id": {"$in": community_ids},
                "requested_by": {"$exists": True},
                "field_name": {"$exists": False},
                "status": RequestStatusConstants.Pending,
            }
        )

    def count_change_requests(self) -> int:
        count = self.db["communities"].count_documents(
            {
                "status": RequestStatusConstants.Pending,
                "field_name": {"$exists": 1},
            }
        )

        count += self.db["resources"].count_documents(
            {
                "status": RequestStatusConstants.Pending,
                "request_id": {"$exists": 1},
            }
        )

        return count
