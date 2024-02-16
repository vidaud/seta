import sqlalchemy as db
from icecream import ic


def bulk_insert(engine: db.Engine, applications: list[dict]):
    """Insert applications into the database"""

    with engine.connect() as connection:
        with connection.begin():

            result = connection.execute(
                statement=db.text(
                    """
                    select count(*) as cnt from public.applications
                    """
                )
            )

            cnt = result.fetchone()[0]
            if cnt > 0:
                ic("Applications already exist in the database.")
                return

            for application in applications:
                connection.execute(
                    statement=db.text(
                        """
                        INSERT INTO public.applications(
	                    name, user_id, description, parent_user_id)
	                    VALUES (:name, :user_id, :description, :parent_user_id);
                        """
                    ),
                    parameters={
                        "name": application["app_name"],
                        "user_id": application["user_id"],
                        "description": application.get("app_description", None),
                        "parent_user_id": application["parent_user_id"],
                    },
                )

    ic(f"Insert {len(applications)} applications into postgres database.")
