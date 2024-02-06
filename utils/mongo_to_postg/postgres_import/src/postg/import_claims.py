import sqlalchemy as db
from icecream import ic


def bulk_insert(engine: db.Engine, claims: list[dict]):
    """Insert claims into the database"""

    with engine.connect() as connection:
        with connection.begin():

            result = connection.execute(
                statement=db.text(
                    """
                    select count(*) as cnt from public.claims
                    """
                )
            )

            cnt = result.fetchone()[0]
            if cnt > 0:
                ic("Claims already exist in the database.")
                return

            for claim in claims:
                connection.execute(
                    statement=db.text(
                        """
                    insert into public.claims (user_id, claim_type, claim_value)
                    values (:user_id, :claim_type, :claim_value)
                    """
                    ),
                    parameters=claim,
                )

    ic(f"Insert {len(claims)} claims into postgres database.")
