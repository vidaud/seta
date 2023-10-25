# pylint: disable=missing-function-docstring
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces.config import IDbConfig
from seta_flask_server.repository.interfaces import IStatsBroker
from seta_flask_server.infrastructure.constants import RequestStatusConstants
from seta_flask_server.infrastructure.scope_constants import CommunityScopeConstants


class StatsBroker(implements(IStatsBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> bool:
        self.config = config

        self.db = config.get_db()

    def count_community_change_requests(self) -> int:
        return self.db["communities"].count_documents(
            {
                "status": RequestStatusConstants.Pending,
                "field_name": {"$exists": 1},
            }
        )

    def count_resource_change_requests(self) -> int:
        return self.db["resources"].count_documents(
            {
                "status": RequestStatusConstants.Pending,
                "request_id": {"$exists": 1},
            }
        )

    def count_community_orphans(self) -> int:
        # get community ids that have an owner assigned
        pipeline = [
            {"$match": {"community_scope": CommunityScopeConstants.Owner}},
            {"$group": {"_id": "$community_id"}},
        ]
        ids = self.db["users"].aggregate(pipeline)

        # get communities that are not in 'ids'
        return self.db["communities"].count_documents(
            {
                "membership": {"$exists": True},
                "community_id": {"$not": {"$in": [i["_id"] for i in ids]}},
            }
        )

    def count_resource_orphans(self, resource_ids: list[str]) -> int:
        if resource_ids:
            db_ids = self.db["resources"].find(
                {"community_id": {"$exists": True}}, {"resource_id": 1}
            )

            orphans = list(
                filter(
                    lambda resource_id: not any(
                        db_id["resource_id"].lower() == resource_id.lower()
                        for db_id in db_ids
                    ),
                    resource_ids,
                )
            )
            return len(orphans)

        return 0
