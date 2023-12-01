# pylint: disable=missing-function-docstring
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, IUserProfileUnsearchables
from seta_flask_server.repository.models import UnsearchablesModel


class UserProfileUnsearchables(implements(IUserProfileUnsearchables)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.db = config.get_db()
        self.collection = self.db["user-profile-unsearchables"]

    def get_unsearchables(self, user_id: str) -> list[str]:
        profile = self.collection.find_one({"user_id": user_id})

        if profile and "data_sources" in profile:
            return profile["data_sources"]

        return None

    def upsert_unsearchables(self, unsearchable: UnsearchablesModel):
        query_filter = {"user_id": unsearchable.user_id}

        if self.collection.count_documents(query_filter, limit=1) > 0:
            self.collection.update_one(
                query_filter, {"$set": unsearchable.model_dump(exclude={"user_id"})}
            )
        else:
            self.collection.insert_one(unsearchable.model_dump())

    def delete_unsearchables(self, user_id: str):
        self.collection.delete_one({"user_id": user_id})
