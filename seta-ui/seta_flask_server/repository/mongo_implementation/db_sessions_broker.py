# pylint: disable=missing-function-docstring
from datetime import datetime, timedelta
import pytz
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, ISessionsBroker
from seta_flask_server.repository.models import UserSession, SessionToken, RefreshedPair


class SessionsBroker(implements(ISessionsBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.config = config
        self.db = config.get_db()
        self.collection = self.db["sessions"]

    def session_create(self, user_session: UserSession) -> None:
        with self.db.client.start_session(causal_consistency=True) as session:
            self.collection.insert_one(user_session.to_json(), session=session)

            tokens = [st.to_json() for st in user_session.session_tokens]
            self.collection.insert_many(tokens, session=session)

    def session_refresh(
        self, user_session: UserSession, refreshed_pair: RefreshedPair
    ) -> None:
        # block after 30 seconds
        blocked_at = datetime.now(tz=pytz.utc) + timedelta(seconds=30)

        with self.db.client.start_session(causal_consistency=True) as session:
            # set block date for all previous tokens
            blocked_update = {"$set": {"blocked_at": blocked_at}}
            self.collection.update_many(
                {"session_id": user_session.session_id, "token_jti": {"$exists": True}},
                blocked_update,
                session=session,
            )

            # insert refreshed tokens
            tokens = [st.to_json() for st in user_session.session_tokens]
            self.collection.insert_many(tokens, session=session)

            if refreshed_pair:
                # set refreshed pair
                refresh_update = {"$set": {"refreshed_pair": refreshed_pair.to_json()}}
                self.collection.update_one(
                    {
                        "session_id": user_session.session_id,
                        "token_jti": refreshed_pair.refresh_jti,
                    },
                    refresh_update,
                    session=session,
                )

    def session_logout(self, session_id: str) -> None:
        now = datetime.now(tz=pytz.utc)

        with self.db.client.start_session(causal_consistency=True) as session:
            uq = {"$set": {"end_at": now}}
            self.collection.update_one(
                {"session_id": session_id, "user_id": {"$exists": True}},
                uq,
                session=session,
            )

            uq = {"$set": {"is_blocked": True, "blocked_at": now}}
            self.collection.update_many(
                {"session_id": session_id, "token_jti": {"$exists": True}},
                uq,
                session=session,
            )

    def session_token_set_blocked(self, token_jti: str) -> None:
        self.collection.update_many(
            {"token_jti": token_jti},
            {"$set": {"is_blocked": True, "blocked_at": datetime.now(tz=pytz.utc)}},
        )

    def session_token_is_blocked(self, token_jti: str) -> bool:
        return (
            self.collection.count_documents(
                {"token_jti": token_jti, "is_blocked": True}
            )
            > 0
        )

    def get_session_token(
        self, session_id: str, token_jti: str, token_type: str = None
    ) -> SessionToken:
        token_filter = {"session_id": session_id, "token_jti": token_jti}

        if token_type:
            token_filter["token_type"] = token_type

        st = self.collection.find_one(token_filter)

        if st is not None:
            return SessionToken.from_db_json(st)

        return None

    def unblock_session_tokens(self, date: datetime):
        self.collection.update_many(
            {"blocked_at": {"$lt": date}},
            {"$set": {"is_blocked": False, "blocked_at": None}},
        )
