import datetime
from flask_sqlalchemy import SQLAlchemy
import pytz

from migrations.catalogues import fields, scopes, roles

from tests.infrastructure.helpers import util, users_data as ud

from seta_flask_server.repository.orm_models import (
    SetaUserOrm,
    RsaKeyOrm,
    ExternalProviderOrm,
    UserClaimOrm,
    SystemScopeOrm,
    CatalogueScopeOrm,
    CatalogueRoleOrm,
    CatalogueFieldOrm,
)


class PostgDbTest:

    def __init__(self, db: SQLAlchemy, user_key_pairs: dict) -> None:

        self.user_key_pairs = user_key_pairs
        self.db = db

    def clear_db(self):
        """Deletes all tables from the database."""

        self.db.drop_all()

    def init_db(self):
        """
        Initialize test database and its collections
        """

        now_date = datetime.datetime.now(tz=pytz.utc)

        self.db.create_all()

        data = ud.load_users_data()

        # save users
        for user in data["users"]:
            self.db.session.add(
                SetaUserOrm(
                    user_id=user["user_id"],
                    email=user["email"],
                    user_type=user["user_type"],
                    status=user["status"],
                    created_at=now_date,
                )
            )

        self.db.session.flush()

        for user in data["users"]:
            user_id = user["user_id"]

            # insert public key
            pub_key = util.get_public_key(user_id, self.user_key_pairs)

            if pub_key:
                rsa_key = RsaKeyOrm(
                    user_id=user_id, rsa_value=pub_key, created_at=now_date
                )
                self.db.session.add(rsa_key)

        # save user providers
        for provider in data["providers"]:
            provider = ExternalProviderOrm(
                user_id=provider["user_id"],
                provider=provider["provider"],
                provider_uid=provider["provider_uid"],
                first_name=provider["first_name"],
                last_name=provider["last_name"],
                domain=provider["domain"],
            )
            self.db.session.add(provider)

        # save user claims
        if data["claims"]:
            for claim in data["claims"]:
                claim = UserClaimOrm(
                    user_id=claim["user_id"],
                    claim_type=claim["claim_type"],
                    claim_value=claim["claim_value"],
                )
                self.db.session.add(claim)

        # save system scopes
        if data["scopes"]:
            for scope in data["scopes"]:
                scope = SystemScopeOrm(
                    user_id=scope["user_id"],
                    area=scope["area"],
                    scope=scope["scope"],
                )
                self.db.session.add(scope)

        # save catalogues
        scopes_to_add = [
            CatalogueScopeOrm(
                area=scope["area"],
                code=scope["code"],
                name=scope["name"],
                description=scope["description"],
                elevated=scope["elevated"],
            )
            for scope in scopes.catalogue_scopes
        ]

        self.db.session.add_all(scopes_to_add)

        roles_to_add = [
            CatalogueRoleOrm(
                code=role["code"],
                name=role["name"],
                description=role["description"],
                default_scopes=role["default_scopes"],
            )
            for role in roles.catalogue_roles
        ]
        self.db.session.add_all(roles_to_add)

        fields_to_add = [
            CatalogueFieldOrm(name=field["name"], description=field["description"])
            for field in fields.catalogue_fields
        ]
        self.db.session.add_all(fields_to_add)

        self.db.session.commit()
