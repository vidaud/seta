import sqlalchemy as db
from icecream import ic


def bulk_insert(engine: db.Engine, sessions: list[dict]):
    """Insert sessions into the database"""

    with engine.connect() as connection:
        with connection.begin():

            result = connection.execute(
                statement=db.text(
                    """
                    select count(*) as cnt from public.sessions
                    """
                )
            )

            cnt = result.fetchone()[0]
            if cnt > 0:
                ic("Sessions already exist in the database.")
                return

            for session in sessions:
                connection.execute(
                    statement=db.text(
                        """
                        INSERT INTO public.sessions(
                        session_id, user_id, provider, provider_uid, created_at, end_at)
                        VALUES (:session_id, :user_id, :provider, :provider_uid, :created_at, :end_at)
                        """
                    ),
                    parameters={
                        "session_id": session["session_id"],
                        "user_id": session["user_id"],
                        "provider": session["authenticated_provider"]["provider"],
                        "provider_uid": session["authenticated_provider"][
                            "provider_uid"
                        ],
                        "created_at": session["created_at"],
                        "end_at": session["end_at"],
                    },
                )

    ic(f"Insert {len(sessions)} sessions into postgres database.")
