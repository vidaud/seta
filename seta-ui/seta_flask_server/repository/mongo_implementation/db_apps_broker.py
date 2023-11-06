# pylint: disable=missing-function-docstring
from datetime import datetime
import pytz
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, IAppsBroker

from seta_flask_server.repository.models import (
    SetaApplication,
    SetaUser,
    SetaUserExt,
    RsaKey,
    ExternalProvider,
)
from seta_flask_server.infrastructure.constants import (
    UserStatusConstants,
    ExternalProviderConstants,
    UserType,
)

from flask import current_app


class AppsBroker(implements(IAppsBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.db = config.get_db()
        self.collection = self.db["users"]

    def get_all_by_parent_id(self, parent_id: str) -> list[SetaApplication]:
        apps = self.collection.find(
            {"parent_user_id": parent_id, "app_name": {"$exists": True}}
        )

        seta_apps = [SetaApplication.from_db_json(a) for a in apps]

        users = list(
            self.collection.find(
                {
                    "user_id": {"$in": [app.user_id for app in seta_apps]},
                    "email": {"$exists": True},
                }
            )
        )

        for sa in seta_apps:
            r = next((u for u in users if u["user_id"] == sa.user_id), None)
            if r is not None:
                sa.user = SetaUser.from_db_json(r)
            else:
                current_app.logger.error("no user found for id %s", sa.user_id)

        return seta_apps

    def get_by_name(self, name: str) -> SetaApplication:
        app = self.collection.find_one({"app_name": name.lower()})

        if app is None:
            return None

        return self._build_seta_app(app)

    def get_by_parent_and_name(self, parent_id: str, name: str) -> SetaApplication:
        app = self.collection.find_one(
            {"parent_user_id": parent_id, "app_name": name.lower()}
        )

        if app is None:
            return None

        return self._build_seta_app(app)

    def app_exists(self, name: str) -> bool:
        return self.collection.count_documents({"app_name": name.lower()}, limit=1) > 0

    def get_by_user_id(self, user_id: str) -> SetaApplication:
        app = self.collection.find_one(
            {"user_id": user_id, "app_name": {"$exists": True}}
        )

        if app is None:
            return None

        return self._build_seta_app(app)

    def create(
        self,
        app: SetaApplication,
        copy_parent_scopes: bool = True,
        copy_parent_rsa: bool = False,
    ):
        # double check the name uniqueness
        if self.app_exists(name=app.app_name):
            return

        now = datetime.now(tz=pytz.utc)
        user_id = SetaUserExt.generate_uuid()

        seta_user = SetaUser(
            user_id=user_id,
            user_type=UserType.Application,
            email=None,
            status=UserStatusConstants.Active,
            created_at=now,
        )
        app.user_id = user_id

        external_provider = ExternalProvider(
            user_id=user_id,
            provider_uid=app.app_name.lower(),
            provider=ExternalProviderConstants.SETA.lower(),
            first_name=None,
            last_name=None,
            domain=ExternalProviderConstants.SETA.lower(),
        )
        rsa_key = None
        resource_scopes = None

        if copy_parent_scopes:
            result = self.collection.find(
                {
                    "user_id": app.parent_user_id,
                    "resource_scope": {"$exists": True},
                },
                {"_id": 0, "user_id": 0},
            )

            resource_scopes = list(result)

            for rs in resource_scopes:
                rs["user_id"] = user_id

        if copy_parent_rsa:
            q = {"user_id": app.parent_user_id, "rsa_value": {"$exists": True}}
            parent_rsa = self.collection.find_one(q)

            if parent_rsa:
                rsa_key = RsaKey(
                    user_id=user_id, rsa_value=parent_rsa["rsa_value"], created_at=now
                )

        with self.db.client.start_session(causal_consistency=True) as session:
            # insert user record
            self.collection.insert_one(seta_user.to_json(), session=session)

            # insert app record
            self.collection.insert_one(app.to_json(), session=session)

            # insert external provider
            self.collection.insert_one(external_provider.to_json(), session=session)

            # insert rsa_key
            if rsa_key is not None:
                self.collection.insert_one(rsa_key.to_json(), session=session)

            # insert parent resource scopes
            if resource_scopes:
                self.collection.insert_many(resource_scopes, session=session)

    def update(self, old: SetaApplication, new: SetaApplication):
        if not new.app_name:
            new.app_name = old.app_name

        new.app_name = new.app_name.lower()

        if new.app_name != old.app_name.lower():
            # double check the name uniqueness
            if self.app_exists(name=new.app_name):
                return

        with self.db.client.start_session(causal_consistency=True) as session:
            self.collection.update_one(
                {"parent_user_id": old.parent_user_id, "app_name": old.app_name},
                {
                    "$set": {
                        "app_name": new.app_name,
                        "app_description": new.app_description,
                    }
                },
                session=session,
            )

            if new.status:
                now_date = datetime.now(tz=pytz.utc)

                self.collection.update_one(
                    {"user_id": old.user_id, "email": {"$exists": True}},
                    {"$set": {"status": new.status, "modified_at": now_date}},
                )

    def delete(self, parent_id: str, name: str):
        app = self.get_by_parent_and_name(parent_id=parent_id, name=name)

        if not app:
            return

        user_id = app.user_id

        with self.db.client.start_session(causal_consistency=True) as session:
            # delete application scopes
            self.collection.delete_many(
                {
                    "user_id": user_id,
                    "resource_scope": {"$exists": True},
                },
                session=session,
            )

            # delete rsa key
            self.collection.delete_one(
                {"user_id": user_id, "rsa_value": {"$exists": True}}, session=session
            )

            # delete external providers
            self.collection.delete_many(
                {
                    "user_id": user_id,
                    "provider": {"$exists": True},
                },
                session=session,
            )

            # delete user account
            self.collection.delete_one(
                {"user_id": user_id, "user_type": UserType.Application}, session=session
            )

            # delete application
            self.collection.delete_one(
                {"parent_user_id": parent_id, "app_name": name.lower()}, session=session
            )

    def _build_seta_app(self, app: dict):
        seta_app = SetaApplication.from_db_json(app)

        user = self.collection.find_one(
            {"user_id": seta_app.user_id, "email": {"$exists": True}}
        )
        if user is not None:
            seta_app.user = SetaUser.from_db_json(user)

        return seta_app
