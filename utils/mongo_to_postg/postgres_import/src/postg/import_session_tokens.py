import sqlalchemy as db
from icecream import ic


def bulk_import(engine: db.Engine, session_tokens: list[dict]):
    """Insert session tokens into the database"""

    with engine.connect() as connection:
        with connection.begin():

            result = connection.execute(
                statement=db.text(
                    """
                    select count(*) as cnt from public.session_tokens
                    """
                )
            )

            cnt = result.fetchone()[0]
            if cnt > 0:
                ic("Session tokens already exist in the database.")
                return

            for session_token in session_tokens:
                refreshed_access_token = None
                refreshed_refresh_token = None

                if session_token.get("refreshed_pair") is not None:
                    refreshed_access_token = session_token["refreshed_pair"][
                        "access_token"
                    ]
                    refreshed_refresh_token = session_token["refreshed_pair"][
                        "refresh_token"
                    ]

                connection.execute(
                    statement=db.text(
                        """
                        INSERT INTO public.session_tokens(
	session_id, token_jti, token_type, created_at, expires_at, is_blocked, blocked_at, refreshed_access_token, refreshed_refresh_token)
	VALUES (:session_id, :token_jti, :token_type, :created_at, :expires_at, :is_blocked, :blocked_at, :refreshed_access_token, :refreshed_refresh_token)
                        """
                    ),
                    parameters={
                        "session_id": session_token["session_id"],
                        "token_jti": session_token["token_jti"],
                        "token_type": session_token["token_type"],
                        "created_at": session_token["created_at"],
                        "expires_at": session_token["expires_at"],
                        "is_blocked": session_token["is_blocked"],
                        "blocked_at": session_token["blocked_at"],
                        "refreshed_access_token": refreshed_access_token,
                        "refreshed_refresh_token": refreshed_refresh_token,
                    },
                )

    ic(f"Insert {len(session_tokens)} session tokens into postgres database.")
