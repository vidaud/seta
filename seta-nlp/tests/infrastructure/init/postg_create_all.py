import sqlalchemy as db


def create_tables(engine: db.Engine) -> None:
    """Create all tables in the database."""

    with engine.connect() as connection:
        with connection.begin():

            connection.execute(
                db.text(
                    """
                            create table if not exists public.users
                            (
                                user_id     varchar(36)  not null  primary key,
                                email       varchar(255) not null  unique,
                                user_type   varchar(255) not null,
                                status      varchar(255) not null,
                                created_at  timestamp    not null,
                                modified_at timestamp
                            );
                            """
                )
            )

            connection.execute(
                db.text(
                    """
                                create table public.rsa_key
                                (
                                    id          serial
                                        primary key,
                                    user_id     varchar(36)   not null,
                                    rsa_value   varchar(2048) not null,
                                    created_at  timestamp     not null,
                                    modified_at timestamp
                                );
                            """
                )
            )

            connection.execute(
                db.text(
                    """
                            create table public.claims
                            (
                                id          serial
                                    primary key,
                                user_id     varchar(36)  not null,
                                claim_type  varchar(255) not null,
                                claim_value varchar(255) not null,
                                constraint uq_user_id_claim_type
                                    unique (user_id, claim_type)
                            );
                            """
                )
            )

            connection.execute(
                db.text(
                    """
                        create table public.providers
                        (
                            id           serial
                                primary key,
                            user_id      varchar(36)  not null,
                            provider_uid varchar(255) not null,
                            provider     varchar(255) not null,
                            first_name   varchar(255),
                            last_name    varchar(255),
                            domain       varchar(255),
                            constraint uq_provider_provider_uid
                                unique (provider, provider_uid)
                        );
                        """
                )
            )

            connection.execute(
                db.text(
                    """
                        CREATE TABLE IF NOT EXISTS public.data_sources
                        (
                            id varchar(36) NOT NULL PRIMARY KEY,
                            title varchar(200) NOT NULL UNIQUE,
                            description varchar(5000) NOT NULL,
                            index_name varchar(200) NOT NULL,
                            organisation varchar(255) NOT NULL,
                            themes varchar(255)[] NOT NULL,
                            status varchar(255) NOT NULL,
                            contact_person varchar(255),
                            contact_email varchar(255),
                            contact_website varchar(255),
                            creator_id varchar(36),
                            created_at timestamp,
                            modified_at timestamp
                        )
                        """
                )
            )

            connection.execute(
                db.text(
                    """
                        create table public.data_source_scopes
                        (
                            id             serial
                                primary key,
                            user_id        varchar(36)  not null,
                            data_source_id varchar(36)  not null,
                            scope          varchar(255) not null,
                            constraint unique_user_data_source
                                unique (user_id, data_source_id, scope)
                        );
                        """
                )
            )

            connection.execute(
                db.text(
                    """
                        create table if not exists public.sessions
                        (
                            session_id   varchar(36) not null
                                primary key,
                            user_id      varchar(36) not null,
                            provider     varchar(255),
                            provider_uid varchar(255),
                            created_at   timestamp,
                            end_at       timestamp
                        );
                        """
                )
            )

            connection.execute(
                db.text(
                    """
                        create table public.session_tokens
                        (
                            session_id              varchar(36)  not null,
                            token_jti               varchar(36)  not null,
                            token_type              varchar(255) not null,
                            created_at              timestamp,
                            expires_at              timestamp,
                            is_blocked              boolean      not null,
                            blocked_at              timestamp,
                            refreshed_access_token  varchar,
                            refreshed_refresh_token varchar,
                            primary key (session_id, token_jti)
                        );
                        """
                )
            )

            connection.execute(
                db.text(
                    """
                        create table public.applications
                        (
                            name           varchar(255) not null
                                primary key,
                            user_id        varchar(36)
                                unique,
                            description    varchar(255) not null,
                            parent_user_id varchar(36)  not null
                        );
                    """
                )
            )

            connection.execute(
                db.text(
                    """
                        create table public.system_scopes
                            (
                                id      serial
                                    primary key,
                                user_id varchar(36)  not null,
                                area    varchar(255) not null,
                                scope   varchar(255) not null
                            );
                    """
                )
            )

            connection.execute(
                db.text(
                    """
                        create table public.profile_unsearchables
                        (
                            user_id      varchar(36)         not null
                                primary key,
                            data_sources character varying[] not null,
                            timestamp    timestamp           not null
                        );

                    """
                )
            )
