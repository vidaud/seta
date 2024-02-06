import sqlalchemy as db
from icecream import ic


def bulk_insert(engine: db.Engine, annotations: list[dict]):
    """Insert annotations into the database"""

    with engine.connect() as connection:
        with connection.begin():

            result = connection.execute(
                statement=db.text(
                    """
                    select count(*) as cnt from public.annotations
                    """
                )
            )

            cnt = result.fetchone()[0]
            if cnt > 0:
                ic("Annotations already exist in the database.")
                return

            for annotation in annotations:
                if not "modified_at" in annotation:
                    annotation["modified_at"] = None

                connection.execute(
                    statement=db.text(
                        """
                        INSERT INTO public.annotations(
                        category, label, color, created_at, modified_at)
                        VALUES (:category, :label, :color, :created_at, :modified_at);
                        """
                    ),
                    parameters=annotation,
                )

    ic(f"Insert {len(annotations)} annotations into postgres database.")
