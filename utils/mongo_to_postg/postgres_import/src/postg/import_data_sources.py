import sqlalchemy as db
from icecream import ic


def bulk_insert(engine: db.Engine, data_sources: list[dict]):
    """Insert data sources into the database"""

    with engine.connect() as connection:
        with connection.begin():

            result = connection.execute(
                statement=db.text(
                    """
                    select count(*) as cnt from public.data_sources
                    """
                )
            )

            cnt = result.fetchone()[0]
            if cnt > 0:
                ic("Data sources already exist in the database.")
                return

            for data_source in data_sources:
                connection.execute(
                    db.text(
                        """
                            insert into public.data_sources (id, title, description, index_name, organisation, themes, 
                                status, contact_person, contact_email, contact_website, creator_id, created_at, modified_at)
                            values (:id, :title, :description, :index_name, :organisation, :themes, 
                                :status, :contact_person, :contact_email, :contact_website, :creator_id, :created_at, :modified_at)
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
                        "created_at": data_source["created_at"],
                        "modified_at": data_source["modified_at"],
                    },
                )

    ic(f"Insert {len(data_sources)} data sources into postgres database.")
