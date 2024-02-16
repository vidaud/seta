import sqlalchemy as db
from icecream import ic


def bulk_insert(engine: db.Engine, users: list[dict]):
    """Insert users into the database"""

    with engine.connect() as connection:
        with connection.begin():

            result = connection.execute(
                statement=db.text(
                    """
                    select count(*) as cnt from public.users
                    """
                )
            )

            cnt = result.fetchone()[0]
            if cnt > 0:
                ic("Users already exist in the database.")
                return

            for user in users:
                if not user.get("email"):
                    user["email"] = user["user_id"] + "@no-email.org"

                connection.execute(
                    statement=db.text(
                        """
                        insert into public.users (user_id, email, user_type, status, created_at, modified_at)
                        values (:user_id, :email, :user_type, :status, :created_at, :modified_at)
                        """
                    ),
                    parameters=user,
                )

    ic(f"Insert {len(users)} users into postgres database.")
