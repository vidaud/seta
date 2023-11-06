from http import HTTPStatus
from injector import inject
from Crypto.PublicKey import RSA
from flask import jsonify

from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restx import Namespace, Resource

from seta_flask_server.repository.interfaces import IRsaKeysBroker
from .models.rsa_dto import rsa_public, rsa_pair_model

rsa_key_ns = Namespace(
    "User RSA Key Pair",
    description="Generate RSA Key Pair for the authenticated user; store the public in the database.",
)
rsa_key_ns.models[rsa_public.name] = rsa_public
rsa_key_ns.models[rsa_pair_model.name] = rsa_pair_model


@rsa_key_ns.route("", endpoint="user_rsa_key", methods=["GET", "POST", "DELETE"])
class RsaKey(Resource):
    @inject
    def __init__(self, rsa_keys_broker: IRsaKeysBroker, *args, api=None, **kwargs):
        super().__init__(api, *args, **kwargs)

        self.rsa_keys_broker = rsa_keys_broker

    @rsa_key_ns.doc(
        description="Retrieve the public rsa key for this user.",
        responses={int(HTTPStatus.OK): "'Retrieved rsa key."},
        security="CSRF",
    )
    @rsa_key_ns.marshal_with(rsa_public, mask="*")
    @jwt_required(fresh=True)
    def get(self):
        """Retrieve the public RSA key"""

        identity = get_jwt_identity()
        key = self.rsa_keys_broker.get_rsa_key(identity["user_id"])

        if key:
            return {"publicKey": key}

        return None

    @rsa_key_ns.doc(
        description="Generate a new public/private keys pair for the user.",
        responses={int(HTTPStatus.CREATED): "Generated rsa keys."},
        security="CSRF",
    )
    @rsa_key_ns.marshal_with(rsa_pair_model, code=HTTPStatus.CREATED, mask="*")
    @jwt_required(fresh=True)
    def post(self):
        """Generate a new public/private keys pair for the user."""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        key_pair = RSA.generate(bits=4096)

        # public key
        pub_key = key_pair.public_key()
        pub_key_pem = pub_key.export_key()
        decoded_pub_key_pem = pub_key_pem.decode("ascii")

        # private key
        priv_key_pem = key_pair.export_key()
        decoded_priv_key_pem = priv_key_pem.decode("ascii")

        self.rsa_keys_broker.set_rsa_key(user_id, decoded_pub_key_pem)

        return {"privateKey": decoded_priv_key_pem, "publicKey": decoded_pub_key_pem}

    @rsa_key_ns.doc(
        description="Delete the public RSA key",
        responses={int(HTTPStatus.OK): "The public key was deleted"},
        security="CSRF",
    )
    @jwt_required(fresh=True)
    def delete(self):
        """Delete the public RSA key"""

        identity = get_jwt_identity()
        self.rsa_keys_broker.delete_by_user_id(identity["user_id"])

        return jsonify(status="success", message="Public key deleted")
