from http import HTTPStatus
from injector import inject

from flask import current_app as app
from flask import jsonify, abort, Blueprint
from flask_jwt_extended import decode_token
from flask_restx import Api, Resource, fields


from seta_flask_server.repository import interfaces

from seta_flask_server.infrastructure.constants import (
    AuthorizedArea,
    UserStatusConstants,
)
from .logic.token_info_logic import get_data_source_permissions


token_info = Blueprint("token_info", __name__)
authorization_api = Api(
    token_info,
    version="1.0",
    title="JWT token authorization",
    doc="/doc",
    description="JWT authorization for seta apis",
)
ns_authorization = authorization_api.namespace("", "Authorization endpoints")

token_model = ns_authorization.model(
    "Token",
    {
        "token": fields.String(description="Encoded token", required=True),
        "authorizationAreas": fields.List(
            fields.String(enum=AuthorizedArea.List),
            description="List of authorized areas",
        ),
    },
)


@ns_authorization.route("/token_info", methods=["POST"])
class TokenInfo(Resource):
    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        session_broker: interfaces.ISessionsBroker,
        data_sources_broker: interfaces.IDataSourcesBroker,
        data_source_scopes_broker: interfaces.IDataSourceScopesBroker,
        profile_broker: interfaces.IUserProfileUnsearchables,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.session_broker = session_broker
        self.data_sources_broker = data_sources_broker
        self.data_source_scopes_broker = data_source_scopes_broker
        self.profile_broker = profile_broker

        super().__init__(api, *args, **kwargs)

    @ns_authorization.doc(
        description="Returns the decoded token including user community permissions",
        responses={
            int(HTTPStatus.OK): "Decoded token as json",
            int(HTTPStatus.BAD_REQUEST): "No token provided",
            int(HTTPStatus.UNAUTHORIZED): "Unauthorized JWT",
            int(HTTPStatus.UNPROCESSABLE_ENTITY): "Invalid token",
        },
    )
    @ns_authorization.expect(token_model, validate=True)
    def post(self):
        """Decodes the token and builds the community scopes for the user identity"""

        r = ns_authorization.payload

        token = r["token"]
        areas = r.get("authorizationAreas", None)

        decoded_token = None
        try:
            decoded_token = decode_token(encoded_token=token)

            jti = decoded_token.get("jti")
            if jti:
                if self.session_broker.session_token_is_blocked(jti):
                    abort(HTTPStatus.UNAUTHORIZED, "Blocked token")

            if areas is not None and AuthorizedArea.DataSources in areas:
                # get user permissions for all resources
                seta_id = decoded_token.get("seta_id")
                if seta_id:
                    user = self.users_broker.get_user_by_id(
                        seta_id["user_id"], load_scopes=False
                    )
                    if user.status != UserStatusConstants.Active:
                        abort(HTTPStatus.UNAUTHORIZED, "User inactive!")

                    decoded_token["resource_permissions"] = get_data_source_permissions(
                        user_id=user.user_id,
                        data_sources_broker=self.data_sources_broker,
                        scopes_broker=self.data_source_scopes_broker,
                        profile_broker=self.profile_broker,
                    )

        except Exception as e:  # pylint: disable=broad-exception-caught
            message = str(e)
            app.logger.exception(message)
            abort(HTTPStatus.UNAUTHORIZED, message)

        app.logger.debug(decoded_token)
        return jsonify(decoded_token)
