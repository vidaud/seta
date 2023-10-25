# pylint: disable=missing-function-docstring
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, ILibraryBroker
from seta_flask_server.repository.models import LibraryItem


class LibraryBroker(implements(ILibraryBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.db = config.get_db()
        self.collection = self.db["library"]

    def create(self, items: list[LibraryItem]):
        self.collection.insert_many([item.to_json() for item in items])

    def get_all_by_parent(self, user_id: str, parent_id: str) -> list[LibraryItem]:
        items = self.collection.find({"user_id": user_id, "parent_id": parent_id}).sort(
            [("type", 1), ("title", 1)]
        )

        return [LibraryItem.from_db_json(item) for item in items]

    def get_by_id(self, user_id: str, item_id: str) -> LibraryItem:
        item = self.collection.find_one({"user_id": user_id, "id": item_id})

        if not item:
            return None

        return LibraryItem.from_db_json(item)

    def update(self, item: LibraryItem):
        json = item.to_json()
        #!do not update 'type' property
        del json["type"]

        self.collection.update_one(
            {"user_id": item.user_id, "id": item.id}, {"$set": item.to_json()}
        )

    def delete(self, user_id: str, item_id: str):
        _ids = []

        self._construct_cascade_ids(user_id=user_id, parent_id=item_id, _ids=_ids)

        self.collection.delete_many({"user_id": user_id, "id": {"$in": _ids}})

    def _construct_cascade_ids(self, user_id: str, parent_id: str, _ids: list[str]):
        children = self.collection.find(
            {"user_id": user_id, "parent_id": parent_id}, {"id": 1}
        )

        for item in children:
            self._construct_cascade_ids(
                user_id=user_id, parent_id=item["id"], _ids=_ids
            )

        _ids.append(parent_id)
