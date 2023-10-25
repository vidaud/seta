from http import HTTPStatus
from injector import inject
from Crypto.PublicKey import RSA
from flask import jsonify

from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restx import Namespace, Resource

from seta_flask_server.repository.interfaces import IRsaKeysBroker
from .models.rsa_dto import rsa_model, rsa_pair_model

rsa_ns = Namespace("RSA Key", description="Account Public RSA Key")
rsa_ns.models[rsa_model.name] = rsa_model
rsa_ns.models[rsa_pair_model.name] = rsa_pair_model


@rsa_ns.route("/rsa-keys", endpoint="me_rsa_key", methods=["GET", "POST", "DELETE"])
class RsaKey(Resource):
    @inject
    def __init__(self, rsa_keys_broker: IRsaKeysBroker, *args, api=None, **kwargs):
        super().__init__(api, *args, **kwargs)

        self.rsa_keys_broker = rsa_keys_broker

    @rsa_ns.doc(
        description="Retrieve the public rsa key for this user.",
        responses={int(HTTPStatus.OK): "'Retrieved rsa key."},
        security="CSRF",
    )
    @rsa_ns.marshal_list_with(rsa_model, mask="*")
    @jwt_required()
    def get(self):
        """Retrieve the public RSA key"""

        identity = get_jwt_identity()
        key = self.rsa_keys_broker.get_rsa_key(identity["user_id"])

        if key:
            return {"username": identity["user_id"], "value": key}

        return None

    @rsa_ns.doc(
        description="Generate a new public/private keys pair for the user.",
        responses={int(HTTPStatus.OK): "Generated rsa keys."},
        security="CSRF",
    )
    @rsa_ns.marshal_list_with(rsa_pair_model, mask="*")
    @jwt_required()
    def post(self):
        """Generate a new public/private keys pair for the user."""

        # TODO: set @jwt_required(fresh=True) forcing a new JWT marked with fresh

        identity = get_jwt_identity()
        key_pair = RSA.generate(bits=4096)

        # public key
        pub_key = key_pair.publickey()
        pub_key_pem = pub_key.exportKey()
        decoded_pub_key_pem = pub_key_pem.decode("ascii")

        # private key
        priv_key_pem = key_pair.exportKey()
        decoded_priv_key_pem = priv_key_pem.decode("ascii")

        self.rsa_keys_broker.set_rsa_key(identity["user_id"], decoded_pub_key_pem)

        return {"privateKey": decoded_priv_key_pem, "publicKey": decoded_pub_key_pem}

    @rsa_ns.doc(
        description="Delete the public RSA key",
        responses={int(HTTPStatus.OK): "The public key was deleted"},
        security="CSRF",
    )
    @jwt_required()
    def delete(self):
        """Delete the public RSA key"""

        # TODO: set @jwt_required(fresh=True) forcing a new JWT marked with fresh

        identity = get_jwt_identity()
        self.rsa_keys_broker.delete_by_user_id(identity["user_id"])

        return jsonify(status="success", message="Public key deleted")
