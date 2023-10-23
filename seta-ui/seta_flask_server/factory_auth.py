"""Flask seta-auth application factory"""

from datetime import datetime
import pytz

from flask import Flask, url_for, session
from werkzeug.middleware.proxy_fix import ProxyFix

from flask_injector import FlaskInjector

from seta_flask_server.infrastructure.clients.cas_client import SetaCasClient
from seta_flask_server.infrastructure.extensions import jwt, logs, github

from seta_flask_server.infrastructure.helpers import MongodbJSONProvider
from seta_flask_server.infrastructure.constants import ExternalProviderConstants

from seta_flask_server.dependency import MongoDbClientModule
from seta_flask_server.repository.interfaces import ISessionsBroker


def create_app(config_object):
    """Main app factory"""

    app = Flask(__name__)
    # Tell Flask it is Behind a Proxy
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_host=1)

    app.config.from_object(config_object)
    app.home_route = app.config.get("HOME_ROUTE")

    # use flask.json in all modules instead of python built-in json
    app.json_provider_class = MongodbJSONProvider

    register_extensions(app)

    with app.app_context():
        register_blueprints(app)

    register_cas_client(app)

    @jwt.additional_claims_loader
    def add_claims_to_access_token(identity):
        additional_claims = {"iss": "SETA Auth Server", "sub": identity["user_id"]}
        return additional_claims

    # Callback function to check if a JWT exists in the database block list
    @jwt.token_in_blocklist_loader
    # pylint: disable-next=unused-argument
    def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
        jti = jwt_payload["jti"]
        sessions_broker = app_injector.injector.get(ISessionsBroker)
        session_id = session.get("session_id")

        return jwt_token_revoked(
            sessions_broker=sessions_broker, jti=jti, session_id=session_id
        )

    app_injector = FlaskInjector(
        app=app,
        modules=[MongoDbClientModule()],
    )

    return app


def register_blueprints(app: Flask):
    """Register application extensions"""

    # pylint: disable=import-outside-toplevel
    from seta_flask_server.blueprints.authentication.token_auth import token_auth
    from seta_flask_server.blueprints.authorization.token_info import token_info

    from .blueprints.authentication.auth import local_auth
    from .blueprints.authentication.auth_ecas import auth_ecas

    authentication_root_v1 = "/authentication/v1"

    app.register_blueprint(token_info, url_prefix="/authorization/v1")

    app.register_blueprint(token_auth, url_prefix=authentication_root_v1)

    app.register_blueprint(local_auth, url_prefix=authentication_root_v1)
    app.register_blueprint(auth_ecas, url_prefix=authentication_root_v1)

    if any(
        provider.lower() == ExternalProviderConstants.GITHUB.lower()
        for provider in app.config.get("SETA_IDENTITY_PROVIDERS", [])
    ):
        from .blueprints.authentication.auth_github import auth_github

        app.register_blueprint(auth_github, url_prefix=authentication_root_v1)


def register_extensions(app: Flask):
    """Register application extensions"""

    github.init_app(app)
    jwt.init_app(app)

    try:
        logs.init_app(app)
    except:  # pylint: disable=bare-except
        app.logger.exception("logs config failed")


def register_cas_client(app: Flask):
    """Register ECAS client for flask application

    Args:
        app: current flask application
    """

    with app.app_context(), app.test_request_context():
        ecas_login_callback_url = url_for(
            "auth_ecas.login_callback_ecas", _external=True
        )

    # the service_url will be changed before ECAS redirect with 'request.url'
    app.cas_client = SetaCasClient(
        # version=3,
        service_url=ecas_login_callback_url,
        server_url=app.config.get("AUTH_CAS_URL"),
    )


def jwt_token_revoked(
    sessions_broker: ISessionsBroker, jti: str, session_id: str = None
) -> bool:
    """Is JWT revoked?

    Verify if either is_blocked flag is set as True
    or blocked_at date is in the past ( => set flag is_blocked = True)

    Args:
        sessions_broker: repository interface for sessions
        jti: token jti
        session_id: session id stored in the session cookie
    """

    is_blocked = sessions_broker.session_token_is_blocked(jti)

    if is_blocked:
        return True

    if session_id:
        token = sessions_broker.get_session_token(session_id=session_id, token_jti=jti)
        now = datetime.now(tz=pytz.utc)

        if (
            token is not None
            and token.blocked_at is not None
            and token.blocked_at.replace(tzinfo=pytz.utc) <= now
        ):
            sessions_broker.session_token_set_blocked(token_jti=jti)
            return True

    return False
