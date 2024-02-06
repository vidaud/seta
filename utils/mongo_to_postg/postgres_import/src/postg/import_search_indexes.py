import sqlalchemy as db
from icecream import ic


def bulk_insert(engine: db.Engine, indexes: list[dict]):
    """Insert search indexes into the database"""

    with engine.connect() as connection:
        with connection.begin():

            result = connection.execute(
                statement=db.text(
                    """
                    select count(*) as cnt from public.search_indexes
                    """
                )
            )

            cnt = result.fetchone()[0]
            if cnt > 0:
                ic("Search indexes already exist in the database.")
                return

            for index in indexes:
                connection.execute(
                    statement=db.text(
                        """
                        INSERT INTO public.search_indexes(
                        index_name, "default", created_at)
                        VALUES (:index_name, :default, :created_at);
                        """
                    ),
                    parameters=index,
                )

    ic(f"Insert {len(indexes)} search indexes into postgres database.")
