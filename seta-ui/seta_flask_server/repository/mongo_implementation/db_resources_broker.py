# pylint: disable=missing-function-docstring
from datetime import datetime
import pytz
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces.config import IDbConfig
from seta_flask_server.repository.interfaces.resources_broker import IResourcesBroker
from seta_flask_server.repository.models import (
    ResourceModel,
    ResourceLimitsModel,
    UserProfileResources,
)
from seta_flask_server.infrastructure.constants import (
    ResourceStatusConstants,
    CommunityStatusConstants,
    ResourceTypeConstants,
)


class ResourcesBroker(implements(IResourcesBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.db = config.get_db()
        self.collection = self.db["resources"]

    def create(self, model: ResourceModel, scopes: list[dict]) -> None:
        if not self.resource_id_exists(model.resource_id):
            now = datetime.now(tz=pytz.utc)

            with self.db.client.start_session(causal_consistency=True) as session:
                # keep default limits
                if model.limits is None:
                    model.limits = ResourceLimitsModel()

                model.created_at = now

                model_json = model.to_json()
                self.collection.insert_one(model_json, session=session)

                user_collection = self.db["users"]
                user_collection.insert_many(scopes, session=session)

    def update(self, model: ResourceModel) -> None:
        model.modified_at = datetime.now(tz=pytz.utc)
        uq = {"$set": model.to_json_update()}

        self.collection.update_one(self._filter_resource_by_id(model.resource_id), uq)

    def delete(self, resource_id: str) -> None:
        user_collection = self.db["users"]
        with self.db.client.start_session(causal_consistency=True) as session:
            # delete resource scopes
            rsf = {"resource_id": resource_id, "resource_scope": {"$exists": True}}
            user_collection.delete_many(rsf, session=session)

            # delete all entries from resources collection
            self.collection.delete_many({"resource_id": resource_id}, session=session)

    def get_by_id(self, resource_id: str) -> ResourceModel:
        resource_dict = self.collection.find_one(
            self._filter_resource_by_id(resource_id)
        )

        if resource_dict is None:
            return None

        model = ResourceModel.from_db_json(resource_dict)
        return model

    def get_all_assigned_to_user_id(self, user_id: str) -> list[ResourceModel]:
        user_collection = self.db["users"]
        rsf = {"user_id": user_id, "resource_scope": {"$exists": True}}

        ids = user_collection.find(rsf, {"resource_id": True})
        resource_ids = [i["resource_id"] for i in ids]

        resources = self.collection.find(
            {
                "resource_id": {"$in": resource_ids},
                "community_id": {"$exists": True},
            }
        )

        return [ResourceModel.from_db_json(c) for c in resources]

    def get_all_queryable_by_user_id(self, user_id: str) -> list[ResourceModel]:
        # get active memberships
        community_ids = self._get_membership_communities(user_id)

        # get active resources
        resources_filter = {
            "community_id": {"$in": community_ids},
            "status": ResourceStatusConstants.Active,
            "type": ResourceTypeConstants.Discoverable,
        }

        profile = self.db["user-profiles"].find_one(
            {
                "user_id": user_id,
                "profile": UserProfileResources.UNSEARCHABLE_PROFILE_ID,
            }
        )

        if profile and "resources" in profile:
            resources_filter["resource_id"] = {"$nin": profile["resources"]}

        resources = self.collection.find(resources_filter)
        return [ResourceModel.from_db_json(c) for c in resources]

    def get_all_by_member_id_and_type(
        self, user_id: str, resource_type: str
    ) -> list[ResourceModel]:
        community_ids = self._get_membership_communities(user_id)

        resources = self.collection.find(
            {
                "community_id": {"$in": community_ids},
                "status": ResourceStatusConstants.Active,
                "type": resource_type,
            }
        )
        return [ResourceModel.from_db_json(c) for c in resources]

    def get_all_by_community_id(self, community_id: str) -> list[ResourceModel]:
        resources = self.collection.find({"community_id": community_id})

        return [ResourceModel.from_db_json(c) for c in resources]

    def resource_id_exists(self, resource_id: str) -> bool:
        exists_count = self.collection.count_documents(
            self._filter_resource_by_id(resource_id)
        )
        return exists_count > 0

    def get_all(self) -> list[ResourceModel]:
        resources = self.collection.find({"community_id": {"$exists": True}})

        return [ResourceModel.from_db_json(c) for c in resources]

    # ------------------------#
    ### Private methods ###

    def _filter_resource_by_id(self, resource_id: str):
        """Get filter dict for a resource"""
        return {"resource_id": resource_id, "community_id": {"$exists": True}}

    def _get_membership_communities(self, user_id: str) -> list[str]:
        # get active memberships
        community_collection = self.db["communities"]

        memberships_filter = {
            "user_id": user_id,
            "status": CommunityStatusConstants.Active,
            "join_date": {"$exists": 1},
        }
        memberships = community_collection.find(memberships_filter, {"community_id": 1})
        return [i["community_id"] for i in memberships]

    # ------------------------#
