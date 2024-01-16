import datetime
import json
from pathlib import Path
import pytz

from pymongo import MongoClient
from tests.infrastructure.helpers.util import get_public_key


def load_users_data() -> dict:
    """Load test users."""

    base_path = Path(__file__).parent
    users_file_path = "../data/users.json"
    users_full_path = (base_path / users_file_path).resolve()

    with open(users_full_path, encoding="utf-8") as fp:
        data = json.load(fp)

        return data


class DbTestSetaApi:
    def __init__(
        self, db_host: str, db_port: int, db_name: str, user_key_pairs: dict
    ) -> None:
        self.db_host = db_host
        self.db_port = db_port
        self.db_name = db_name

        self.user_key_pairs = user_key_pairs

        client = MongoClient(self.db_host, self.db_port)
        self.db = client[self.db_name]

    def clear_db(self):
        """Delete database"""

        for c in self.db.list_collection_names():
            self.db.drop_collection(c)

    def init_db(self):
        """
        Initialize test database and its collections
        """

        created_at = datetime.datetime.now(tz=pytz.utc)
        collection = self.db["users"]

        data = load_users_data()

        # save users
        for user in data["users"]:
            user_id = user["user_id"]

            cnt = collection.count_documents({"user_id": user_id})
            if cnt > 0:
                continue

            collection.insert_one(
                {
                    "user_id": user_id,
                    "email": user["email"],
                    "user_type": user["user_type"],
                    "status": user["status"],
                    "created_at": created_at,
                }
            )

            # insert public key
            pub_key = get_public_key(user_id, self.user_key_pairs)

            if pub_key:
                collection.insert_one(
                    {"user_id": user_id, "rsa_value": pub_key, "created_at": created_at}
                )

        # save user claims
        if "claims" in data:
            collection.insert_many(data["claims"])
        # save user providers
        if "providers" in data:
            collection.insert_many(data["providers"])
