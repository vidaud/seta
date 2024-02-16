# pylint: disable=missing-function-docstring

from datetime import datetime, timedelta
import pytz

from flask_sqlalchemy import SQLAlchemy
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, ISessionsBroker
from seta_flask_server.repository.models import UserSession, SessionToken, RefreshedPair

from seta_flask_server.repository.orm_models import UserSessionOrm, UserSessionTokenOrm


class OrmSessionsBroker(implements(ISessionsBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.config = config
        self.db: SQLAlchemy = config.get_db()

    def session_create(self, user_session: UserSession) -> None:

        orm_session = to_orm_model(user_session)
        self.db.session.add(orm_session)

        if user_session.session_tokens:

            self.db.session.flush()

            orm_tokens = [
                to_token_orm_model(token) for token in user_session.session_tokens
            ]
            self.db.session.add_all(orm_tokens)

        self.db.session.commit()

    def session_refresh(
        self, user_session: UserSession, refreshed_pair: RefreshedPair
    ) -> None:
        # block after 30 seconds
        blocked_at = datetime.now(tz=pytz.utc) + timedelta(seconds=30)

        # set block date for all previous tokens
        self.db.session.query(UserSessionTokenOrm).filter_by(
            session_id=user_session.session_id
        ).update(
            {
                UserSessionTokenOrm.is_blocked: True,
                UserSessionTokenOrm.blocked_at: blocked_at,
            }
        )

        # insert refreshed tokens
        if user_session.session_tokens:
            orm_tokens = [
                to_token_orm_model(token) for token in user_session.session_tokens
            ]
            self.db.session.add_all(orm_tokens)

        if refreshed_pair:
            # set refreshed pair for the current access token
            orm_token = (
                self.db.session.query(UserSessionTokenOrm)
                .filter_by(
                    session_id=user_session.session_id,
                    token_jti=refreshed_pair.refresh_jti,
                )
                .first()
            )

            orm_token.refreshed_access_token = refreshed_pair.access_token
            orm_token.refreshed_refresh_token = refreshed_pair.refresh_token

        self.db.session.commit()

    def session_logout(self, session_id: str) -> None:
        now = datetime.now(tz=pytz.utc)

        self.db.session.query(UserSessionOrm).filter_by(session_id=session_id).update(
            {"end_at": now}
        )

        self.db.session.query(UserSessionTokenOrm).filter_by(
            session_id=session_id
        ).update(
            {
                UserSessionTokenOrm.is_blocked: True,
                UserSessionTokenOrm.blocked_at: now,
            }
        )

        self.db.session.commit()

    def session_token_set_blocked(self, token_jti: str) -> None:
        self.db.session.query(UserSessionTokenOrm).filter_by(
            token_jti=token_jti
        ).update(
            {
                UserSessionTokenOrm.is_blocked: True,
                UserSessionTokenOrm.blocked_at: datetime.now(tz=pytz.utc),
            }
        )
        self.db.session.commit()

    def session_token_is_blocked(self, token_jti: str) -> bool:

        return (
            self.db.session.query(UserSessionTokenOrm)
            .filter_by(token_jti=token_jti, is_blocked=True)
            .first()
            is not None
        )

    def get_session_token(
        self, session_id: str, token_jti: str, token_type: str = None
    ) -> SessionToken:

        query = self.db.session.query(UserSessionTokenOrm).filter_by(
            session_id=session_id, token_jti=token_jti
        )

        if token_type:
            query = query.filter_by(token_type=token_type)

        orm_token = query.first()

        if orm_token is None:
            return None

        return from_token_orm_model(orm_token)

    def unblock_session_tokens(self, date: datetime):
        self.db.session.query(UserSessionTokenOrm).filter(
            UserSessionTokenOrm.blocked_at < date
        ).update(
            {
                UserSessionTokenOrm.is_blocked: False,
                UserSessionTokenOrm.blocked_at: None,
            }
        )
        self.db.session.commit()


def to_token_orm_model(token: SessionToken) -> UserSessionTokenOrm:
    orm_token = UserSessionTokenOrm(
        session_id=token.session_id,
        token_jti=token.token_jti,
        token_type=token.token_type,
        created_at=token.created_at,
        expires_at=token.expires_at,
        is_blocked=token.is_blocked,
        blocked_at=token.blocked_at,
    )

    if token.refreshed_pair is not None:
        orm_token.refreshed_access_token = token.refreshed_pair.access_token
        orm_token.refreshed_refresh_token = token.refreshed_pair.refresh_token

    return orm_token


def from_token_orm_model(orm_token: UserSessionTokenOrm) -> SessionToken:
    token = SessionToken(
        session_id=orm_token.session_id,
        token_jti=orm_token.token_jti,
        token_type=orm_token.token_type,
        created_at=orm_token.created_at,
        expires_at=orm_token.expires_at,
        is_blocked=orm_token.is_blocked,
        blocked_at=orm_token.blocked_at,
    )

    if orm_token.refreshed_access_token is not None:
        token.refreshed_pair = RefreshedPair(
            access_token=orm_token.refreshed_access_token,
            refresh_token=orm_token.refreshed_refresh_token,
        )

    return token


def to_orm_model(session: UserSession) -> UserSessionOrm:

    orm_session = UserSessionOrm(
        session_id=session.session_id,
        user_id=session.user_id,
        created_at=session.created_at,
        end_at=session.end_at,
    )

    if session.authenticated_provider is not None:
        orm_session.provider = session.authenticated_provider.get("provider")
        orm_session.provider_uid = session.authenticated_provider.get("provider_uid")

    return orm_session


def from_orm_model(orm_session: UserSessionOrm) -> UserSession:

    session = UserSession(
        session_id=orm_session.session_id,
        user_id=orm_session.user_id,
        created_at=orm_session.created_at,
        end_at=orm_session.end_at,
    )

    if orm_session.provider:
        session.authenticated_provider = {
            "provider": orm_session.provider,
            "provider_uid": orm_session.provider_uid,
        }

    return session
