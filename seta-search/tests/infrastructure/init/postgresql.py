import datetime
import pytz

import sqlalchemy as db

from tests.infrastructure.helpers.util import get_public_key
from tests.infrastructure.helpers.data_loader import load_users_data, load_data_sources

from .postg_create_all import create_tables


class PostgDBConnection:

    def __init__(
        self, db_host: str, db_port: int, db_name: str, db_user: str, db_pass: str
    ) -> None:

        self.engine = db.create_engine(
            f"postgresql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"
        )


class PostgDbTest:

    def __init__(self, db_connection: PostgDBConnection, user_key_pairs: dict) -> None:
        self.db_connection = db_connection
        self.user_key_pairs = user_key_pairs

    def init_db(self) -> None:
        """Initialize test database and its collections."""

        create_tables(self.db_connection.engine)
        self._populate_tables()

    def clear_db(self):
        """Deletes all tables from the database."""

        with self.db_connection.engine.connect() as connection:
            with connection.begin():
                connection.execute(db.text("drop table if exists public.rsa_key"))
                connection.execute(db.text("drop table if exists public.claims"))
                connection.execute(db.text("drop table if exists public.providers"))

                connection.execute(
                    db.text("drop table if exists public.data_source_scopes")
                )
                connection.execute(db.text("drop table if exists public.data_sources"))

                connection.execute(
                    db.text("drop table if exists public.session_tokens")
                )
                connection.execute(db.text("drop table if exists public.sessions"))

                connection.execute(db.text("drop table if exists public.applications"))
                connection.execute(db.text("drop table if exists public.system_scopes"))
                connection.execute(
                    db.text("drop table if exists public.profile_unsearchables")
                )
                connection.execute(db.text("drop table if exists public.users"))

    def _populate_tables(self) -> None:
        with self.db_connection.engine.connect() as connection:
            with connection.begin():

                now_date = datetime.datetime.now(tz=pytz.utc)

                data = load_users_data()

                # save users
                for user in data["users"]:
                    connection.execute(
                        statement=db.text(
                            """
                            insert into public.users (user_id, email, user_type, status, created_at)
                            values (:user_id, :email, :user_type, :status, :created_at)
                            """
                        ),
                        parameters=dict(
                            user_id=user["user_id"],
                            email=user["email"],
                            user_type=user["user_type"],
                            status=user["status"],
                            created_at=now_date,
                        ),
                    )

                    # insert public key
                    pub_key = get_public_key(user["user_id"], self.user_key_pairs)

                    if pub_key:
                        connection.execute(
                            statement=db.text(
                                """
                            insert into public.rsa_key (user_id, rsa_value, created_at)
                            values (:user_id, :rsa_value, :created_at)
                            """
                            ),
                            parameters={
                                "user_id": user["user_id"],
                                "rsa_value": pub_key,
                                "created_at": now_date,
                            },
                        )

                # save user providers
                for provider in data["providers"]:
                    connection.execute(
                        statement=db.text(
                            """
                            insert into public.providers (user_id, provider_uid, provider, first_name, last_name, domain)
                            values (:user_id, :provider_uid, :provider, :first_name, :last_name, :domain)
                            """
                        ),
                        parameters={
                            "user_id": provider["user_id"],
                            "provider_uid": provider["provider_uid"],
                            "provider": provider["provider"],
                            "first_name": provider["first_name"],
                            "last_name": provider["last_name"],
                            "domain": provider["domain"],
                        },
                    )

                # save user claims
                for claim in data["claims"]:
                    connection.execute(
                        statement=db.text(
                            """
                        insert into public.claims (user_id, claim_type, claim_value)
                        values (:user_id, :claim_type, :claim_value)
                        """
                        ),
                        parameters={
                            "user_id": claim["user_id"],
                            "claim_type": claim["claim_type"],
                            "claim_value": claim["claim_value"],
                        },
                    )

                # Load resources:
                data = load_data_sources()

                if "dataSources" in data:
                    for data_source in data["dataSources"]:
                        connection.execute(
                            db.text(
                                """
                            insert into public.data_sources (id, title, description, index_name, organisation, themes, 
                                status, contact_person, contact_email, contact_website, creator_id, created_at)
                            values (:id, :title, :description, :index_name, :organisation, :themes, 
                                :status, :contact_person, :contact_email, :contact_website, :creator_id, :created_at)
                            """
                            ),
                            parameters={
                                "id": data_source["data_source_id"],
                                "title": data_source["title"],
                                "description": data_source["description"],
                                "index_name": data_source["index_name"],
                                "organisation": data_source["organisation"],
                                "themes": data_source["themes"],
                                "status": data_source["status"],
                                "contact_person": data_source["contact"]["person"],
                                "contact_email": data_source["contact"]["email"],
                                "contact_website": data_source["contact"]["website"],
                                "creator_id": data_source["creator_id"],
                                "created_at": now_date,
                            },
                        )

                # save data source scopes
                if "scopes" in data:
                    for scope in data["scopes"]:
                        connection.execute(
                            statement=db.text(
                                """
                            insert into public.data_source_scopes (user_id, data_source_id, scope)
                            values (:user_id, :data_source_id, :scope)
                            """
                            ),
                            parameters={
                                "user_id": scope["user_id"],
                                "data_source_id": scope["data_source_id"],
                                "scope": scope["scope"],
                            },
                        )
