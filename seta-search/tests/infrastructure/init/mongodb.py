import json
from pathlib import Path
import datetime
import pytz
from pymongo import MongoClient

from tests.infrastructure.helpers.util import get_public_key


def _load_file_data(file_path: str) -> dict:
    """Load data from file."""

    base_path = Path(__file__).parent
    full_path = (base_path / file_path).resolve()

    with open(full_path, encoding="utf-8") as f:
        data = json.load(f)

        return data


def load_users_data() -> dict:
    """Load test users."""

    return _load_file_data(file_path="../data/users.json")


def load_data_sources() -> dict:
    """Load test data sources."""

    return _load_file_data(file_path="../data/data_sources.json")


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

        # Load resources:
        data = load_data_sources()
        collection = self.db["data-sources"]

        if "dataSources" in data:
            for data_source in data["dataSources"]:
                data_source["created_at"] = created_at
                data_source["modified_at"] = None

                collection.insert_one(data_source)

        collection = self.db["data-source-scopes"]
        if "scopes" in data:
            for scope in data["scopes"]:
                collection.insert_one(scope)

    def clear_db(self):
        """Delete database."""

        for c in self.db.list_collection_names():
            self.db.drop_collection(c)
