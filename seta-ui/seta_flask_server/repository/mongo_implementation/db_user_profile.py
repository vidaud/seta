# pylint: disable=missing-function-docstring
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, IUserProfile
from seta_flask_server.repository.models import UserProfileResources


class UserProfile(implements(IUserProfile)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.db = config.get_db()
        self.collection = self.db["user-profiles"]

    # ------un-searchable resources ----#

    def get_unsearchables(self, user_id: str) -> list[str]:
        profile = self.collection.find_one(self._filter_unsearchable(user_id))

        if profile and "resources" in profile:
            return profile["resources"]

        return None

    def upsert_unsearchables(self, profile: UserProfileResources):
        un_filter = self._filter_unsearchable(profile.user_id)
        if self.collection.count_documents(un_filter, limit=1) > 0:
            self.collection.update_one(un_filter, {"$set": profile.to_update_json()})
        else:
            json = profile.to_json()
            json["profile"] = UserProfileResources.UNSEARCHABLE_PROFILE_ID

            self.collection.insert_one(json)

    def delete_unsearchables(self, user_id: str):
        self.collection.delete_one(self._filter_unsearchable(user_id))

    def _filter_unsearchable(self, user_id: str):
        return {
            "user_id": user_id,
            "profile": UserProfileResources.UNSEARCHABLE_PROFILE_ID,
        }

    # ---------------------------------#
