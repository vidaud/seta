from http import HTTPStatus
from injector import inject

from flask import current_app
from flask import abort, Blueprint
from flask_restx import Api, Resource, fields
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_cors import CORS

from seta_flask_server.infrastructure.auth_helpers import (
    create_session,
    validate_public_key,
)
from seta_flask_server.infrastructure.constants import ExternalProviderConstants

from seta_flask_server.repository import interfaces

token_auth = Blueprint("token_auth", __name__)
CORS(token_auth)

auth_api = Api(
    token_auth,
    version="1.0",
    title="JWT token authentication",
    doc="/doc",
    description="JWT authentication for user and guests",
)
ns_auth = auth_api.namespace("", "Authentication endpoints", validate=True)

AUTH_PROVIDERS = [
    provider.lower()
    for provider in current_app.config.get("SETA_IDENTITY_PROVIDERS", [])
]
AUTH_PROVIDERS.append(ExternalProviderConstants.SETA.lower())

auth_data = ns_auth.model(
    "AuthData",
    {
        "username": fields.String(
            required=True, description="User or application name"
        ),
        "provider": fields.String(
            required=True, description="Authentication provider", enum=AUTH_PROVIDERS
        ),
        "rsa_original_message": fields.String(
            required=True, description="Any random message"
        ),
        "rsa_message_signature": fields.String(
            required=True,
            description="Signature using hex format, string of hexadecimal numbers.",
        ),
    },
)

auth_model = ns_auth.model(
    "AuthTokens",
    {
        "access_token": fields.String(description="JWT access token"),
        "refresh_token": fields.String(description="JWT refresh token"),
    },
)


@ns_auth.route("/token", methods=["POST"])
class JWTUserToken(Resource):
    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        rsa_broker: interfaces.IRsaKeysBroker,
        sessions_broker: interfaces.ISessionsBroker,
        *args,
        api=None,
        **kwargs,
    ):
        super().__init__(api, *args, **kwargs)

        self.users_broker = users_broker
        self.rsa_broker = rsa_broker
        self.sessions_broker = sessions_broker

    @ns_auth.doc(
        description="Generates JWT (JSON Web Token) access and refresh tokens \
                    for authenticated users or user applications. \n \
                    The RSA signature is used to confirm the user's identity. \
                    Visit the /docs/apis/access-token/ webpage for an example \
                    of how to programmatically generate random signatures.",
        responses={
            int(HTTPStatus.OK): "Success",
            int(HTTPStatus.UNAUTHORIZED): "Invalid User",
            int(HTTPStatus.FORBIDDEN): "Invalid Signature",
        },
    )
    @ns_auth.expect(auth_data)
    @ns_auth.marshal_with(auth_model)
    def post(self):
        """Generates JWT (JSON Web Token) access and refresh tokens for a valid signature."""

        args = ns_auth.payload

        user = self.users_broker.get_user_by_provider(
            provider_uid=args["username"].lower(), provider=args["provider"].lower()
        )
        if user is None or user.is_not_active():
            abort(HTTPStatus.UNAUTHORIZED, "Invalid User")

        public_key = self.rsa_broker.get_rsa_key(user.user_id)
        if public_key is None:
            # return 'Public Key Unset', 503
            current_app.logger.error("Public Key Unset for user id " + user.user_id)
            abort(HTTPStatus.UNAUTHORIZED, "Invalid user")

        if not validate_public_key(
            public_key, args["rsa_original_message"], args["rsa_message_signature"]
        ):
            # return 'Invalid Signature'

            abort(HTTPStatus.FORBIDDEN, "Invalid Signature")

        identity = user.to_identity_json()
        additional_claims = {"role": user.role, "user_type": user.user_type}

        access_token = create_access_token(
            identity=identity, fresh=True, additional_claims=additional_claims
        )
        refresh_token = create_refresh_token(
            identity=identity, additional_claims=additional_claims
        )

        user_session = create_session(
            seta_user=user, access_token=access_token, refresh_token=refresh_token
        )
        self.sessions_broker.session_create(user_session)

        return {"access_token": access_token, "refresh_token": refresh_token}


refresh_parser = ns_auth.parser()
refresh_parser.add_argument(
    "Authorization",
    location="headers",
    required=False,
    type="apiKey",
    help="Bearer JWT refresh token",
)
# refresh_parser.add_argument("X-CSRF-TOKEN", location="headers", required=False, type="string")


@ns_auth.route("/token/refresh", methods=["POST"])
class JWTRefreshToken(Resource):
    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        sessions_broker: interfaces.ISessionsBroker,
        *args,
        api=None,
        **kwargs,
    ):
        super().__init__(api, *args, **kwargs)

        self.users_broker = users_broker
        self.sessions_broker = sessions_broker

    @ns_auth.doc(
        description="Generates a new JWT access token using the original refresh token, \
                    which should be included in the `Authorization` header in the format: `Bearer <refresh_token>`.",
        responses={
            int(HTTPStatus.OK): "Success",
            int(HTTPStatus.UNAUTHORIZED): "Refresh token verification failed",
        },
    )
    @ns_auth.expect(refresh_parser)
    @ns_auth.marshal_with(auth_model)
    @jwt_required(refresh=True)
    def post(self):
        """Generates new access token using original refresh token."""

        identity = get_jwt_identity()

        user = self.users_broker.get_user_by_id(identity["user_id"])

        if user is None or user.is_not_active():
            abort(HTTPStatus.UNAUTHORIZED, "Invalid User")

        # other additional_claims are added via additional_claims_loader method: factory->add_claims_to_access_token
        additional_claims = {"role": user.role}

        access_token = create_access_token(
            identity=identity, fresh=False, additional_claims=additional_claims
        )
        refresh_token = create_refresh_token(
            identity=identity, additional_claims=additional_claims
        )

        user_session = create_session(
            seta_user=user, access_token=access_token, refresh_token=refresh_token
        )
        self.sessions_broker.session_create(user_session)

        # block current refresh token
        jti = get_jwt()["jti"]
        self.sessions_broker.session_token_set_blocked(token_jti=jti)

        return {"access_token": access_token, "refresh_token": refresh_token}
