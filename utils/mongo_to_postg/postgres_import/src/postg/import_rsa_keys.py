import sqlalchemy as db
from icecream import ic


def bulk_insert(engine: db.Engine, rsa_keys: list[dict]):
    """Insert rsa keys into the database"""

    with engine.connect() as connection:
        with connection.begin():

            result = connection.execute(
                statement=db.text(
                    """
                    select count(*) as cnt from public.rsa_key
                    """
                )
            )

            cnt = result.fetchone()[0]
            if cnt > 0:
                ic("Rsa keys already exist in the database.")
                return

            for rsa_key in rsa_keys:

                if not "modified_at" in rsa_key:
                    rsa_key["modified_at"] = None

                connection.execute(
                    statement=db.text(
                        """
                        insert into public.rsa_key (user_id, rsa_value, created_at, modified_at)
                        values (:user_id, :rsa_value, :created_at, :modified_at)
                        """
                    ),
                    parameters=rsa_key,
                )

    ic(f"Insert {len(rsa_keys)} rsa keys into postgres database.")
