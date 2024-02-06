import sqlalchemy as db
from icecream import ic


def bulk_insert(engine: db.Engine, providers: list[dict]):
    """Insert providers into the database"""

    with engine.connect() as connection:
        with connection.begin():

            result = connection.execute(
                statement=db.text(
                    """
                    select count(*) as cnt from public.providers
                    """
                )
            )

            cnt = result.fetchone()[0]
            if cnt > 0:
                ic("Providers already exist in the database.")
                return

            for provider in providers:
                connection.execute(
                    statement=db.text(
                        """
                            insert into public.providers (user_id, provider_uid, provider, first_name, last_name, domain)
                            values (:user_id, :provider_uid, :provider, :first_name, :last_name, :domain)
                            """
                    ),
                    parameters=provider,
                )

    ic(f"Insert {len(providers)} providers into postgres database.")
