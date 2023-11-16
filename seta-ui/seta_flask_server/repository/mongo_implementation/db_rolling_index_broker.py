# pylint: disable=missing-function-docstring
from datetime import datetime
import pytz
from interface import implements
from injector import inject
from pymongo import database as pm_db, collection as pm_col

from seta_flask_server.repository.interfaces import IDbConfig, IRollingIndexBroker

from seta_flask_server.repository.models import (
    RollingIndex,
    StorageIndex,
)


class RollingIndexBroker(implements(IRollingIndexBroker)):
    db: pm_db.Database
    collection: pm_col.Collection

    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.db = config.get_db()
        self.collection = self.db["rolling-indexes"]

    def create(self, index: RollingIndex):
        # check name uniqueness
        if self.name_exists(rolling_index_name=index.rolling_index_name):
            return
        if self.title_exists(rolling_index_title=index.title):
            return

        with self.db.client.start_session(causal_consistency=True) as session:
            self.collection.insert_one(index.to_json(), session=session)
            self.collection.insert_many(
                [item.to_json() for item in index.storage], session=session
            )

    def update(self, index: RollingIndex):
        self.collection.update_one(
            {"rolling_index_name": index.rolling_index_name},
            {"$set": index.to_json_update()},
        )

    def name_exists(self, rolling_index_name: str) -> bool:
        return (
            self.collection.count_documents(
                {"rolling_index_name": rolling_index_name.lower()}, limit=1
            )
            > 0
        )

    def title_exists(self, rolling_index_title: str, except_name: str = None) -> bool:
        filter_exists = {"title": rolling_index_title}

        if except_name:
            filter_exists["rolling_index_name"] = {"$ne": except_name.lower()}
        else:
            filter_exists["rolling_index_name"] = {"$exists": 1}

        return (
            self.collection.count_documents(
                filter_exists,
                limit=1,
            )
            > 0
        )

    def create_active_index(self, rolling_index_name: str):
        if not self.name_exists(rolling_index_name=rolling_index_name):
            return

        now_date = datetime.now(tz=pytz.utc)

        index = StorageIndex(
            parent=rolling_index_name.lower(), is_active=True, created_at=now_date
        )

        with self.db.client.start_session(causal_consistency=True) as session:
            count_indexes = self.collection.count_documents(
                {"parent": index.parent}, session=session
            )
            index.sequence = count_indexes + 1

            index.name = StorageIndex.get_name(
                prefix=index.parent, sequence=index.sequence
            )

            # inactivate current active storage index
            self.collection.update_many(
                filter={"parent": rolling_index_name, "is_active": True},
                update={"$set": {"is_active": False, "modified_at": now_date}},
                session=session,
            )

            self.collection.insert_one(index.to_json(), session=session)

    def update_communities(self, rolling_index_name: str, community_ids: list[str]):
        rolling_index = self.collection.find_one(
            {"rolling_index_name": rolling_index_name, "is_default": False},
            {"community_ids": 1, "past_community_ids": 1},
        )

        if not rolling_index:
            return

        current_community_ids = rolling_index.get("community_ids")

        with self.db.client.start_session(causal_consistency=True) as session:
            if current_community_ids:
                new_set = set(community_ids)
                new_past = [
                    c_id for c_id in current_community_ids if c_id not in new_set
                ]

                past_community_ids = rolling_index.get("past_community_ids")
                if past_community_ids:
                    new_past += past_community_ids

                self.collection.update_one(
                    {"rolling_index_name": rolling_index_name},
                    {"$set": {"past_community_ids": list(tuple(new_past))}},
                    session=session,
                )

            self.collection.update_one(
                {"rolling_index_name": rolling_index_name},
                {"$set": {"community_ids": list(tuple(community_ids))}},
                session=session,
            )

    def get_all(self) -> list[RollingIndex]:
        rolling_index_result = self.collection.find(
            {"rolling_index_name": {"$exists": True}}
        )

        rolling_indexes = [RollingIndex.from_db_json(ri) for ri in rolling_index_result]

        for rolling_index in rolling_indexes:
            storage_result = self.collection.find(
                {"parent": rolling_index.rolling_index_name}
            )

            rolling_index.storage = [
                StorageIndex.from_db_json(s) for s in storage_result
            ]

        return rolling_indexes

    def get_active_index_for_resource(self, resource_id: str) -> str:
        rolling_index = None

        community_id = self._get_community_id_for_resource(resource_id)

        if community_id is not None:
            rolling_index = self.collection.find_one(
                {"community_ids": community_id}, {"rolling_index_name": 1}
            )

            if rolling_index and rolling_index.get("is_disabled", False):
                rolling_index = None

        if not rolling_index:
            rolling_index = self.collection.find_one(
                {"is_default": True}, {"rolling_index_name": 1}
            )

        if rolling_index:
            storage_index = self.collection.find_one(
                {"parent": rolling_index["rolling_index_name"], "is_active": True},
                {"name": 1},
            )

            if storage_index:
                return storage_index["name"]

        return None

    def get_storage_indexes_for_resource(self, resource_id: str) -> tuple[str]:
        storage_indexes = []

        # append the default list
        default_rolling_index = self.collection.find_one(
            {"is_default": True}, {"rolling_index_name": 1}
        )
        if default_rolling_index:
            indexes = self.collection.find(
                {"parent": default_rolling_index["rolling_index_name"]},
                {"name": 1},
            )
            storage_indexes += [index["name"] for index in indexes]

        # append storage for (currently or in the past) assigned rolling indexes
        community_id = self._get_community_id_for_resource(resource_id)

        if community_id is not None:
            rolling_indexes = self.collection.find(
                {
                    "$or": [
                        {"community_ids": community_id},
                        {"past_community_ids": community_id},
                    ]
                },
                {"rolling_index_name": 1},
            )

            other_indexes = self.collection.find(
                {
                    "parent": {
                        "$in": [
                            index["rolling_index_name"] for index in rolling_indexes
                        ]
                    }
                },
                {"name": 1},
            )

            storage_indexes += [other_index["name"] for other_index in other_indexes]

        return tuple(storage_indexes)

    def get_assigned_index(self, community_id: str) -> str:
        rolling_index = self.collection.find_one(
            {"community_ids": community_id}, {"rolling_index_name": 1}
        )

        if rolling_index:
            return rolling_index["rolling_index_name"]

        return None

    def _get_community_id_for_resource(self, resource_id: str) -> str:
        resources_collection = self.db["resources"]

        find_resource = resources_collection.find_one(
            {"resource_id": resource_id, "community_id": {"$exists": True}},
            {"community_id": 1},
        )

        if find_resource:
            return find_resource["community_id"]

        return None
