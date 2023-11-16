from http import HTTPStatus
from injector import inject
from Crypto.PublicKey import RSA
from flask import jsonify

from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restx import Resource, abort

from seta_flask_server.repository import interfaces
from seta_flask_server.blueprints.profile.models.rsa_dto import (
    rsa_public,
    rsa_pair_model,
)

from .ns import applications_ns


@applications_ns.route(
    "/<string:name>/rsa-key", endpoint="app_rsa_key", methods=["GET", "POST", "DELETE"]
)
@applications_ns.param("name", "Application name")
class ApplicationRsaKeyResource(Resource):
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
    @applications_ns.marshal_with(rsa_public, mask="*")
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
        description="Generate a new public/private keys pair for the application.",
        responses={
            int(HTTPStatus.CREATED): "Generated rsa keys.",
            int(HTTPStatus.NOT_FOUND): "Application not found.",
        },
        security="CSRF",
    )
    @applications_ns.marshal_with(rsa_pair_model, code=HTTPStatus.CREATED, mask="*")
    @jwt_required(fresh=True)
    def post(self, name: str):
        """Generate a new public/private keys pair for the application."""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        app = self.apps_broker.get_by_parent_and_name(parent_id=user_id, name=name)

        if app is None:
            abort(HTTPStatus.NOT_FOUND, "Application not found")

        key_pair = RSA.generate(bits=4096)

        # public key
        pub_key = key_pair.public_key()
        pub_key_pem = pub_key.export_key()
        decoded_pub_key_pem = pub_key_pem.decode("ascii")

        # private key
        priv_key_pem = key_pair.export_key()
        decoded_priv_key_pem = priv_key_pem.decode("ascii")

        self.rsa_keys_broker.set_rsa_key(app.user_id, decoded_pub_key_pem)

        return {"privateKey": decoded_priv_key_pem, "publicKey": decoded_pub_key_pem}

    @applications_ns.doc(
        description="Deletes the public RSA key",
        responses={
            int(HTTPStatus.OK): "The public key was deleted",
            int(HTTPStatus.NOT_FOUND): "Application not found.",
        },
        security="CSRF",
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
