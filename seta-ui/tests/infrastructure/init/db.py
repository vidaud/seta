import datetime
import json
from pathlib import Path
import pytz

from pymongo import MongoClient
from seta_flask_server.repository.models import SetaUser, RsaKey

from migrations.catalogues import (
    scopes_catalogue_builder as scopes_builder,
    roles_catalogue_builder as roles_builder,
    rolling_index_builder as index_builder,
)

from tests.infrastructure.helpers.util import get_public_key


def load_users_data() -> dict:
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

        now_date = datetime.datetime.now(tz=pytz.utc)
        user_collection = self.db["users"]

        data = load_users_data()

        # save users
        for user in data["users"]:
            su = SetaUser(
                user_id=user["user_id"],
                email=user["email"],
                user_type=user["user_type"],
                status=user["status"],
                created_at=now_date,
            )
            user_collection.insert_one(su.to_json())

            # insert public key
            pub_key = get_public_key(su.user_id, self.user_key_pairs)

            if pub_key:
                rk = RsaKey(user_id=su.user_id, rsa_value=pub_key, created_at=now_date)
                user_collection.insert_one(rk.to_json())

        # save user claims
        user_collection.insert_many(data["claims"])
        # save user scopes
        user_collection.insert_many(data["scopes"])
        # save user providers
        user_collection.insert_many(data["providers"])

        catalogue_collection = self.db["catalogues"]

        catalogue_collection.insert_many(
            scopes_builder.ScopesCatalogueBuilder.build_system_scopes("system-scopes")
        )
        catalogue_collection.insert_many(
            scopes_builder.ScopesCatalogueBuilder.build_community_scopes(
                "community-scopes"
            )
        )
        catalogue_collection.insert_many(
            scopes_builder.ScopesCatalogueBuilder.build_resource_scopes(
                "resource-scopes"
            )
        )
        catalogue_collection.insert_many(
            roles_builder.RolesCatalogueBuilder.build_app_roles("app-roles")
        )
        catalogue_collection.insert_many(
            roles_builder.RolesCatalogueBuilder.build_community_roles("community-roles")
        )

        index_collection = self.db["rolling-indexes"]

        rolling_index = index_builder.default_rolling_index(now_date)
        storage_indexes = rolling_index.pop("storage")

        index_collection.insert_one(rolling_index)
        index_collection.insert_many(storage_indexes)
