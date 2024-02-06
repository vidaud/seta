import sqlalchemy as db
from icecream import ic


def bulk_insert(engine: db.Engine, scopes: list[dict]):
    """Insert scopes into the database"""

    with engine.connect() as connection:
        with connection.begin():

            result = connection.execute(
                statement=db.text(
                    """
                    select count(*) as cnt from public.data_source_scopes
                    """
                )
            )

            cnt = result.fetchone()[0]
            if cnt > 0:
                ic("Data source scopes already exist in the database.")
                return

            for scope in scopes:
                connection.execute(
                    statement=db.text(
                        """
                            insert into public.data_source_scopes (user_id, data_source_id, scope)
                            values (:user_id, :data_source_id, :scope)
                            """
                    ),
                    parameters=scope,
                )

    ic(f"Insert {len(scopes)} data source scopes into postgres database.")
