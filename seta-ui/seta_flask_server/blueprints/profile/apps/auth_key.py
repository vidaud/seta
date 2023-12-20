from http import HTTPStatus
from injector import inject
from Crypto.PublicKey import RSA
from flask import jsonify

from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restx import Resource, abort

from seta_flask_server.repository import interfaces
from seta_flask_server.blueprints.profile.models import auth_dto as dto

from .ns import applications_ns


@applications_ns.route(
    "/<string:name>/auth-key",
    endpoint="app_auth_key",
    methods=["GET", "POST", "DELETE"],
)
@applications_ns.param("name", "Application name")
class ApplicationAuthKeyResource(Resource):
    @inject
    def __init__(
        self,
        apps_broker: interfaces.IAppsBroker,
        rsa_keys_broker: interfaces.IRsaKeysBroker,
        *args,
        api=None,
        **kwargs
    ):
        super().__init__(api, *args, **kwargs)

        self.apps_broker = apps_broker
        self.rsa_keys_broker = rsa_keys_broker

    @applications_ns.doc(
        description="Retrieve the public rsa key for this application.",
        responses={
            int(HTTPStatus.OK): "'Retrieved rsa key.",
            int(HTTPStatus.NOT_FOUND): "Application not found.",
        },
        security="CSRF",
    )
    @applications_ns.marshal_with(dto.auth_public_key, mask="*")
    @jwt_required(fresh=True)
    def get(self, name: str):
        """Retrieve the public RSA key"""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        app = self.apps_broker.get_by_parent_and_name(parent_id=user_id, name=name)

        if app is None:
            abort(HTTPStatus.NOT_FOUND, "Application not found")

        key = self.rsa_keys_broker.get_rsa_key(app.user_id)

        if key:
            return {"publicKey": key}

        return None

    @applications_ns.doc(
        description="Stores public security key for the user.",
        responses={
            int(HTTPStatus.OK): "Public key saved.",
            int(HTTPStatus.NOT_FOUND): "Application not found.",
            int(HTTPStatus.BAD_REQUEST): "Key is invalid",
        },
        security="CSRF",
    )
    @applications_ns.response(
        int(HTTPStatus.OK), "", dto.response_dto.response_message_model
    )
    @applications_ns.response(
        int(HTTPStatus.BAD_REQUEST), "", dto.response_dto.error_model
    )
    @applications_ns.expect(dto.auth_public_key)
    @jwt_required(fresh=True)
    def post(self, name: str):
        """Stores a new public key for the application."""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        app = self.apps_broker.get_by_parent_and_name(parent_id=user_id, name=name)

        if app is None:
            abort(HTTPStatus.NOT_FOUND, "Application not found")

        public_key = applications_ns.payload.get("publicKey", None)

        if not public_key:
            abort(HTTPStatus.BAD_REQUEST, message="Missing public key.")

        try:
            RSA.import_key(public_key)
        except Exception:
            abort(
                HTTPStatus.BAD_REQUEST,
                message="Key is invalid. You must supply a key in OpenSSH public key format.",
            )

        self.rsa_keys_broker.set_rsa_key(app.user_id, public_key)

        return jsonify(status="success", message="Public key saved")

    @applications_ns.doc(
        description="Deletes the public RSA key",
        responses={
            int(HTTPStatus.OK): "The public key was deleted",
            int(HTTPStatus.NOT_FOUND): "Application not found.",
        },
        security="CSRF",
    )
    @applications_ns.response(
        int(HTTPStatus.OK), "", dto.response_dto.response_message_model
    )
    @jwt_required(fresh=True)
    def delete(self, name: str):
        """Deletes the public RSA key"""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        app = self.apps_broker.get_by_parent_and_name(parent_id=user_id, name=name)

        if app is None:
            abort(HTTPStatus.NOT_FOUND, "Application not found")

        self.rsa_keys_broker.delete_by_user_id(app.user_id)

        return jsonify(status="success", message="Public key deleted.")
