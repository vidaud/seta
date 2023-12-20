from http import HTTPStatus
from injector import inject
from flask import jsonify
from Crypto.PublicKey import RSA

from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restx import Namespace, Resource, abort

from seta_flask_server.repository.interfaces import IRsaKeysBroker
from .models import auth_dto as dto

auth_key_ns = Namespace(
    "User Authentication Key",
    description="Manage public security key for the authenticated user.",
)
auth_key_ns.models.update(dto.ns_models)


@auth_key_ns.route("", endpoint="user_auth_key", methods=["GET", "POST", "DELETE"])
class AuthKeyResource(Resource):
    @inject
    def __init__(self, rsa_keys_broker: IRsaKeysBroker, *args, api=None, **kwargs):
        super().__init__(api, *args, **kwargs)

        self.rsa_keys_broker = rsa_keys_broker

    @auth_key_ns.doc(
        description="Retrieve the public key for this user.",
        responses={int(HTTPStatus.OK): "'Retrieved public key."},
        security="CSRF",
    )
    @auth_key_ns.marshal_with(dto.auth_public_key)
    @jwt_required(fresh=True)
    def get(self):
        """Retrieves the public key"""

        identity = get_jwt_identity()
        key = self.rsa_keys_broker.get_rsa_key(identity["user_id"])

        if key:
            return {"publicKey": key}

        return None

    @auth_key_ns.doc(
        description="Store public security key for the user.",
        responses={
            int(HTTPStatus.OK): "Public key saved.",
            int(HTTPStatus.BAD_REQUEST): "Key is invalid",
        },
        security="CSRF",
    )
    @auth_key_ns.response(
        int(HTTPStatus.OK), "", dto.response_dto.response_message_model
    )
    @auth_key_ns.response(int(HTTPStatus.BAD_REQUEST), "", dto.response_dto.error_model)
    @auth_key_ns.expect(dto.auth_public_key)
    @jwt_required(fresh=True)
    def post(self):
        """Store public security key for the user."""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        public_key = auth_key_ns.payload.get("publicKey", None)

        if not public_key:
            abort(HTTPStatus.BAD_REQUEST, message="Missing public key.")

        try:
            RSA.import_key(public_key)
        except Exception:
            abort(
                HTTPStatus.BAD_REQUEST,
                message="Key is invalid. You must supply a key in OpenSSH public key format.",
            )

        self.rsa_keys_broker.set_rsa_key(user_id, public_key)

        return jsonify(status="success", message="Public key saved")

    @auth_key_ns.doc(
        description="Delete the public key",
        responses={int(HTTPStatus.OK): "The public key was deleted"},
        security="CSRF",
    )
    @auth_key_ns.response(
        int(HTTPStatus.OK), "", dto.response_dto.response_message_model
    )
    @jwt_required(fresh=True)
    def delete(self):
        """Delete the public RSA key."""

        identity = get_jwt_identity()
        self.rsa_keys_broker.delete_by_user_id(identity["user_id"])

        return jsonify(status="success", message="Public key deleted")
