import datetime
import pytz

from pymongo import MongoClient

# pylint: disable-next=no-name-in-module
from seta_flask_server.repository.models import SetaUser, RsaKey

from mongodb_migrations.catalogues import (
    scopes_catalogue_builder as scopes_builder,
    roles_catalogue_builder as roles_builder,
)

# pylint: disable-next=no-name-in-module
from tests.infrastructure.helpers.util import get_public_key
from tests.infrastructure.helpers import users_data as ud


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

        data = ud.load_users_data()

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
        if data["scopes"]:
            user_collection.insert_many(data["scopes"])
        # save user providers
        user_collection.insert_many(data["providers"])

        catalogue_collection = self.db["catalogues"]

        system_scopes = scopes_builder.ScopesCatalogueBuilder.build_system_scopes(
            "system-scopes"
        )
        if system_scopes:
            catalogue_collection.insert_many(system_scopes)

        data_source_scopes = (
            scopes_builder.ScopesCatalogueBuilder.build_data_source_scopes(
                "data-source-scopes"
            )
        )
        if data_source_scopes:
            catalogue_collection.insert_many(data_source_scopes)

        app_roles = roles_builder.RolesCatalogueBuilder.build_app_roles("app-roles")
        if app_roles:
            catalogue_collection.insert_many(app_roles)
