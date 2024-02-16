import sqlalchemy as db
from icecream import ic


def bulk_insert(engine: db.Engine, profiles: list[dict]):
    """Insert profile into the database"""

    with engine.connect() as connection:
        with connection.begin():

            result = connection.execute(
                statement=db.text(
                    """
                    select count(*) as cnt from public.profile_unsearchables
                    """
                )
            )

            cnt = result.fetchone()[0]
            if cnt > 0:
                ic("Profiles already exist in the database.")
                return

            for profile in profiles:
                connection.execute(
                    statement=db.text(
                        """
                        INSERT INTO public.profile_unsearchables(
                        user_id, data_sources, "timestamp")
                        VALUES (:user_id, :data_sources, :timestamp);
                        """
                    ),
                    parameters=profile,
                )

    ic(f"Insert {len(profiles)} profiles into postgres database.")
