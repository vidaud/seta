import json
from pymongo import MongoClient
from pathlib import Path

import datetime
import pytz

from tests.infrastructure.helpers.util import get_public_key


def _load_file_data(file_path: str) -> dict:
    base_path = Path(__file__).parent
    full_path = (base_path / file_path).resolve()

    with open(full_path, encoding="utf-8") as f:
        data = json.load(f)

        return data


def load_users_data() -> dict:
    return _load_file_data(file_path="../data/users.json")


def load_communities_data() -> dict:
    return _load_file_data(file_path="../data/communities.json")


def load_resources_data() -> dict:
    return _load_file_data(file_path="../data/resources.json")


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

            # current_app.logger.debug("Append user: " + su.user_id)

        # save user claims
        if "claims" in data:
            collection.insert_many(data["claims"])
        # save user scopes
        if "scopes" in data:
            collection.insert_many(data["scopes"])
        # save user providers
        if "providers" in data:
            collection.insert_many(data["providers"])

        """
            Load communities:
        """
        data = load_communities_data()
        collection = self.db["communities"]

        if "communities" in data:
            for community in data["communities"]:
                community["created_at"] = created_at
                community["modified_at"] = None

                collection.insert_one(community)

        if "memberships" in data:
            for membership in data["memberships"]:
                membership["join_date"] = created_at
                membership["modified_at"] = None

                collection.insert_one(membership)

        """
            Load resources:
        """
        data = load_resources_data()
        collection = self.db["resources"]

        if "resources" in data:
            for resource in data["resources"]:
                resource["created_at"] = created_at
                resource["modified_at"] = None

                collection.insert_one(resource)

    def clear_db(self):
        for c in self.db.list_collection_names():
            self.db.drop_collection(c)
