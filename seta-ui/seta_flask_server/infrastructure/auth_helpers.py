from datetime import datetime
import re
import binascii
import pytz
import shortuuid

from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15

from flask import Response, make_response, redirect, session

from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import set_access_cookies, set_refresh_cookies
from flask_jwt_extended import decode_token

from seta_flask_server.repository.models import SetaUser, UserSession, SessionToken
from seta_flask_server.repository.interfaces import ISessionsBroker
from .helpers import set_token_info_cookies


def create_login_response(
    seta_user: SetaUser, session_broker: ISessionsBroker, next_url: str
) -> Response:
    """
    Common part after third-party successful authentication

    :param auth_user:
        The SetaUser object created after third-party response

    :param userBroker:
        The user broker for database query

    :param next:
        Next url redirect
    """

    # additional_claims are added via additional_claims_loader method: factory->add_claims_to_access_token
    identity = seta_user.to_identity_json()

    access_token = create_access_token(identity, fresh=True)
    refresh_token = create_refresh_token(identity)

    user_session = create_session(
        seta_user=seta_user, access_token=access_token, refresh_token=refresh_token
    )
    session_broker.session_create(user_session)

    response = make_response(redirect(next_url))

    session["session_id"] = user_session.session_id
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)
    set_token_info_cookies(
        response=response,
        access_token_encoded=access_token,
        refresh_token_encoded=refresh_token,
    )

    return response


def create_session_token(
    session_id: str, token: str, now: datetime = None
) -> SessionToken:
    """Created session token object"""

    if now is None:
        now = datetime.now(tz=pytz.utc)

    dat = decode_token(token, allow_expired=True)
    return SessionToken(
        session_id=session_id,
        token_jti=dat["jti"],
        token_type=dat["type"],
        expires_at=datetime.fromtimestamp(dat["exp"], tz=pytz.utc),
        created_at=now,
    )


def create_session(
    seta_user: SetaUser, access_token: str, refresh_token: str
) -> UserSession:
    """Created session object"""

    now = datetime.now(tz=pytz.utc)
    session_id = shortuuid.ShortUUID().random(length=24)

    user_session = UserSession(
        session_id=session_id, user_id=seta_user.user_id, created_at=now
    )

    if seta_user.authenticated_provider is not None:
        user_session.authenticated_provider = {
            "provider_uid": seta_user.authenticated_provider.provider_uid,
            "provider": seta_user.authenticated_provider.provider,
        }

    at = create_session_token(session_id=session_id, token=access_token, now=now)
    rt = create_session_token(session_id=session_id, token=refresh_token, now=now)

    user_session.session_tokens = [rt, at]

    return user_session


def validate_next_url(next_url: str) -> bool:
    """
    Validates relative URL (no scheme or authority) with absolute path
    """

    pattern = "\A((\/[a-z0-9\-._~%!$&'()*+,;=:@]+)+\/?)"  # pylint: disable=anomalous-backslash-in-string

    if next_url:
        regex = re.compile(pattern, re.IGNORECASE)
        match = regex.match(next_url)

        return bool(match)

    return False


def validate_public_key(public, message, signature):
    """Public key validation with pkcs"""

    try:
        public_key = RSA.import_key(public)
        digest = SHA256.new(message.encode())
        pkcs1_15.new(public_key).verify(digest, binascii.unhexlify(signature))
    except Exception:
        return False
    return True
