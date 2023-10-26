from http import HTTPStatus
from injector import inject

from flask import current_app as app
from flask import jsonify, abort, Blueprint
from flask_jwt_extended import decode_token
from flask_restx import Api, Resource, reqparse


from seta_flask_server.repository import interfaces

from seta_flask_server.infrastructure.constants import (
    AuthorizedArea,
    UserStatusConstants,
)
from .logic.token_info_logic import get_resource_permissions


token_info = Blueprint("token_info", __name__)
authorization_api = Api(
    token_info,
    version="1.0",
    title="JWT token authorization",
    doc="/doc",
    description="JWT authorization for seta apis",
)
ns_authorization = authorization_api.namespace("", "Authorization endpoints")

request_parser = reqparse.RequestParser()
request_parser.add_argument(
    "token", location="json", required=True, nullable=False, help="Encoded token"
)
request_parser.add_argument(
    "auth_area",
    location="json",
    required=False,
    action="append",
    help=f"Authorized areas, a list of {AuthorizedArea.List}",
)


@ns_authorization.route("/token_info", methods=["POST"])
class TokenInfo(Resource):
    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        resources_broker: interfaces.IResourcesBroker,
        session_broker: interfaces.ISessionsBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.resources_broker = resources_broker
        self.session_broker = session_broker

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
    @ns_authorization.expect(request_parser, validate=True)
    def post(self):
        """Decodes the token and builds the community scopes for the user identity"""

        r = authorization_api.payload
        token = r["token"]
        areas = r["auth_area"]

        decoded_token = None
        try:
            decoded_token = decode_token(encoded_token=token)

            jti = decoded_token.get("jti")
            if jti:
                if self.session_broker.session_token_is_blocked(jti):
                    abort(HTTPStatus.UNAUTHORIZED, "Blocked token")

            if areas is not None and AuthorizedArea.Resources in areas:
                # get user permissions for all resources
                seta_id = decoded_token.get("seta_id")
                if seta_id:
                    user = self.users_broker.get_user_by_id(seta_id["user_id"])
                    if user.status != UserStatusConstants.Active:
                        abort(HTTPStatus.UNAUTHORIZED, "User inactive!")

                    decoded_token["resource_permissions"] = get_resource_permissions(
                        user=user, resources_broker=self.resources_broker
                    )

        except Exception as e:  # pylint: disable=broad-exception-caught
            message = str(e)
            app.logger.exception(message)
            abort(HTTPStatus.UNAUTHORIZED, message)

        app.logger.debug(decoded_token)
        return jsonify(decoded_token)
