# pylint: disable=missing-function-docstring
from datetime import datetime
import pytz
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces.config import IDbConfig
from seta_flask_server.repository.interfaces.rsa_keys_broker import IRsaKeysBroker


class RsaKeysBroker(implements(IRsaKeysBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.db = config.get_db()
        self.collection = self.db["users"]

    def get_rsa_key(self, user_id: str):
        result = self.collection.find_one(
            {"user_id": user_id, "rsa_value": {"$exists": True}}
        )

        if result is None:
            return None

        return result["rsa_value"]

    def set_rsa_key(self, user_id: str, value: str):
        rsa_key = self.collection.find_one(
            {"user_id": user_id, "rsa_value": {"$exists": True}}
        )
        now = datetime.now(tz=pytz.utc)

        if rsa_key is None:
            s = {"user_id": user_id, "rsa_value": value, "created_at": now}
            self.collection.insert_one(s)
        else:
            self.collection.update_one(
                {"user_id": user_id, "rsa_value": {"$exists": True}},
                {"$set": {"rsa_value": value, "modified_at": now}},
            )

    def delete_by_user_id(self, user_id: str):
        self.collection.delete_many(
            {"user_id": user_id, "rsa_value": {"$exists": True}}
        )
