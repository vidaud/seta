import sqlalchemy as db
from icecream import ic


def bulk_insert(engine: db.Engine, libraries: list[dict]):
    """Insert libraries into the database"""

    with engine.connect() as connection:
        with connection.begin():

            result = connection.execute(
                statement=db.text(
                    """
                    select count(*) as cnt from public.library
                    """
                )
            )

            cnt = result.fetchone()[0]
            if cnt > 0:
                ic("Libraries already exist in the database.")
                return

            for library in libraries:
                connection.execute(
                    statement=db.text(
                        """
                        INSERT INTO public.library(
	user_id, item_id, title, parent_id, item_type, document_id, link, created_at, modified_at)
	VALUES (:user_id, :item_id, :title, :parent_id, :item_type, :document_id, :link, :created_at, :modified_at);
                        """
                    ),
                    parameters={
                        "user_id": library["user_id"],
                        "item_id": library["id"],
                        "title": library["title"],
                        "parent_id": library.get("parent_id", None),
                        "item_type": library["type"],
                        "document_id": library.get("document_id", None),
                        "link": library.get("link", None),
                        "created_at": library["created_at"],
                        "modified_at": library.get("modified_at", None),
                    },
                )

    ic(f"Insert {len(libraries)} libraries into postgres database.")
