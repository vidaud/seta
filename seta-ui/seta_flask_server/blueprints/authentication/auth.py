from http import HTTPStatus
from injector import inject


from flask import abort, current_app as app, url_for
from flask import (
    jsonify,
    redirect,
    make_response,
    session,
    Blueprint,
    request as flask_request,
)

from flask_jwt_extended import get_jwt, jwt_required, get_jwt_identity
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import (
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
)

from flask_restx import Api, Resource

from seta_flask_server.repository.models import UserSession, RefreshedPair
from seta_flask_server.infrastructure.constants import ExternalProviderConstants
from seta_flask_server.infrastructure.helpers import (
    set_token_info_cookies,
    unset_token_info_cookies,
)
from seta_flask_server.infrastructure.auth_helpers import create_session_token

from seta_flask_server.repository.interfaces import ISessionsBroker, IUsersBroker

from .models.auth_dto import (
    status_model,
    user_info_model,
    authenticators_model,
    auth_models,
)

DOC = "/web/doc"
if app.config.get("DISABLE_SWAGGER_DOCUMENTATION"):
    DOC = False

local_auth = Blueprint("auth", __name__)
local_auth_api = Api(
    local_auth,
    version="1.0",
    title="SeTA Authentication",
    doc=DOC,
    description="Authentication methods for the web application",
    default_swagger_filename="swagger_auth.json",
)

local_auth_api.models.update(auth_models)

ns_auth = local_auth_api.namespace("", "SETA Authentication Endpoints")


@ns_auth.route("/logout/callback", methods=["GET"])
class SetaLogoutCallback(Resource):
    @inject
    def __init__(self, sessions_broker: ISessionsBroker, *args, api=None, **kwargs):
        super().__init__(api, *args, **kwargs)
        self.sessions_broker = sessions_broker

    @ns_auth.doc(
        description="Third-party provider callback for local logout",
        responses={int(HTTPStatus.FOUND): "Redirect to home route"},
    )
    def get(self):
        """
        Redirect from CAS logout request after CAS logout successfully.
        """

        session_id = session.get("session_id")
        if session_id:
            self.sessions_broker.session_logout(session_id)

        session.clear()

        response = make_response(redirect(app.home_route))
        unset_jwt_cookies(response)
        unset_token_info_cookies(response=response)

        return response


@ns_auth.route("/logout", methods=["POST"], doc={"description": "Local logout"})
@ns_auth.response(
    int(HTTPStatus.OK), "Remove tokens from local domain cookies", status_model
)
class SetaLogout(Resource):
    @inject
    def __init__(self, sessions_broker: ISessionsBroker, *args, api=None, **kwargs):
        self.sessions_broker = sessions_broker
        super().__init__(api, *args, **kwargs)

    def post(self):
        """
        Remove tokens from cookies, but third-party cookies will remain
        """

        session_id = session.get("session_id")

        try:
            if session_id:
                self.sessions_broker.session_logout(session_id)
        except Exception:
            app.logger.exception("Logout->post")

        session.clear()

        response = jsonify({"status": "success"})
        unset_jwt_cookies(response)
        unset_token_info_cookies(response)

        return response


@ns_auth.route(
    "/refresh", methods=["POST"], doc={"description": "Refresh access token"}
)
@ns_auth.response(int(HTTPStatus.OK), "Set new access token in cookies", status_model)
class SetaRefresh(Resource):
    @inject
    def __init__(
        self,
        sessions_broker: ISessionsBroker,
        users_broker: IUsersBroker,
        *args,
        api=None,
        **kwargs,
    ):
        super().__init__(api, *args, **kwargs)

        self.sessions_broker = sessions_broker
        self.users_broker = users_broker

    @jwt_required(refresh=True)
    def post(self):
        """Refresh access token."""

        identity = get_jwt_identity()

        user = self.users_broker.get_user_by_id(identity["user_id"])

        if user is None or user.is_not_active():
            abort(HTTPStatus.UNAUTHORIZED, "Invalid User")

        jti = get_jwt()["jti"]

        access_token = None
        refresh_token = None

        session_id = session.get("session_id")
        if session_id:
            # check if there's already a generated pair for this refresh token (validation already passed!)
            # if yes, return these
            session_token = self.sessions_broker.get_session_token(
                session_id=session_id, token_jti=jti, token_type="refresh"
            )

            app.logger.debug(session_token)

            if session_token is not None and session_token.refreshed_pair is not None:
                app.logger.debug(
                    "%s: session_token.refreshed_pair found: %s",
                    flask_request.remote_addr,
                    session_token.refreshed_pair.to_json(),
                )

                access_token = session_token.refreshed_pair.access_token
                refresh_token = session_token.refreshed_pair.refresh_token

        if access_token is None:
            access_token = create_access_token(identity=identity, fresh=False)
            refresh_token = create_refresh_token(identity=identity)

            if session_id:
                # save new refreshed tokens in the database

                at = create_session_token(session_id=session_id, token=access_token)
                rt = create_session_token(session_id=session_id, token=refresh_token)

                user_session = UserSession(
                    session_id=session_id, session_tokens=[rt, at]
                )

                app.logger.debug(
                    "%s: refresh tokens for %s", flask_request.remote_addr, jti
                )

                refreshed_pair = RefreshedPair(
                    refresh_jti=jti,
                    access_token=access_token,
                    refresh_token=refresh_token,
                )
                self.sessions_broker.session_refresh(
                    user_session=user_session, refreshed_pair=refreshed_pair
                )

        response = jsonify({"status": "success"})
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)

        set_token_info_cookies(
            response=response,
            access_token_encoded=access_token,
            refresh_token_encoded=refresh_token,
        )

        return response


@ns_auth.route("/user-info", endpoint="me_user_info", methods=["GET"])
class UserInfo(Resource):
    @inject
    def __init__(self, users_broker: IUsersBroker, *args, api=None, **kwargs):
        super().__init__(api, *args, **kwargs)
        self.users_broker = users_broker

    @ns_auth.doc(
        description="Retrieve info for this user.",
        responses={
            int(HTTPStatus.OK): "Retrieved info.",
            int(HTTPStatus.NOT_FOUND): "User not found",
        },
        security="CSRF",
    )
    @ns_auth.marshal_with(user_info_model, mask="*")
    @jwt_required()
    def get(self):
        """Returns user details"""

        identity = get_jwt_identity()

        if "provider_uid" in identity:
            user = self.users_broker.get_user_by_provider(
                provider_uid=identity["provider_uid"], provider=identity["provider"]
            )
        else:
            user = self.users_broker.get_user_by_id(
                user_id=identity["user_id"], load_scopes=False
            )
            user.authenticated_provider = user.external_providers[0]

        if user is None or user.is_not_active():
            abort(HTTPStatus.NOT_FOUND, "User not found in the database!")

        return {
            "username": user.user_id,
            "firstName": user.authenticated_provider.first_name,
            "lastName": user.authenticated_provider.last_name,
            "email": user.email,
            "role": user.role,
            "domain": user.authenticated_provider.domain,
        }


@ns_auth.route("/authenticators", methods=["GET"], endpoint="authenticators")
class SetaIdentityProviders(Resource):
    @ns_auth.doc(
        description="Retrieve authenticators for SeTA web application.",
        responses={int(HTTPStatus.OK): "Retrieved list."},
    )
    @ns_auth.marshal_list_with(authenticators_model, mask="*")
    def get(self):
        """Identity providers."""
        identity_providers = list(app.config.get("SETA_IDENTITY_PROVIDERS", []))

        result = []

        if any(
            p.lower() == ExternalProviderConstants.ECAS.lower()
            for p in identity_providers
        ):
            result.append(
                {
                    "name": ExternalProviderConstants.ECAS,
                    "login_url": url_for("auth_ecas.login"),
                    "logout_url": url_for("auth_ecas.logout_ecas"),
                }
            )

        if any(
            p.lower() == ExternalProviderConstants.GITHUB.lower()
            for p in identity_providers
        ):
            result.append(
                {
                    "name": ExternalProviderConstants.GITHUB,
                    "login_url": url_for("auth_github.login"),
                    "logout_url": url_for("auth._seta_logout"),
                }
            )

        return result
