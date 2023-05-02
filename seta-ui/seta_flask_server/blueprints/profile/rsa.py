from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restx import Namespace, Resource

from http import HTTPStatus
from injector import inject
from Crypto.PublicKey import RSA
from flask import jsonify

from seta_flask_server.repository.interfaces import IRsaKeysBroker
from .models.rsa_dto import rsa_model, rsa_pair_model

rsa_ns = Namespace('RSA Key', description='Account Public RSA Key')
rsa_ns.models[rsa_model.name] = rsa_model
rsa_ns.models[rsa_pair_model.name] = rsa_pair_model

@rsa_ns.route('/rsa-keys', endpoint="me_rsa_key", methods=['GET','POST','DELETE'])
class RsaKey(Resource):
    @inject
    def __init__(self, rsaKeysBroker: IRsaKeysBroker, api=None, *args, **kwargs):
        self.rsaKeysBroker = rsaKeysBroker
        
        super().__init__(api, *args, **kwargs)
    
    
    @rsa_ns.doc(description='Retrieve the public rsa key for this user.',        
        responses={int(HTTPStatus.OK): "'Retrieved rsa key."},
        security='CSRF')
    @rsa_ns.marshal_list_with(rsa_model, mask="*")
    @jwt_required()
    def get(self):
        """Retrieve the public RSA key"""
        
        identity = get_jwt_identity()
        key = self.rsaKeysBroker.get_rsa_key(identity["user_id"])

        if key:
            return {
                "username": identity["user_id"],
                "value": key
                }
        
        return None
    
    @rsa_ns.doc(description='Generate a new public/private keys pair for the user.',        
        responses={int(HTTPStatus.OK): "Generated rsa keys."},
        security='CSRF')
    @rsa_ns.marshal_list_with(rsa_pair_model, mask="*")
    @jwt_required()
    def post(self):
        """Generate a new public/private keys pair for the user."""

        identity = get_jwt_identity() 
        keyPair = RSA.generate(bits=4096)

        # public key
        pubKey = keyPair.publickey()
        pubKeyPEM = pubKey.exportKey()
        decodedPubKeyPEM = pubKeyPEM.decode('ascii')

        # private key
        privKeyPEM = keyPair.exportKey()
        decodedPrivKeyPEM = privKeyPEM.decode('ascii')

        self.rsaKeysBroker.set_rsa_key(identity["user_id"], decodedPubKeyPEM)

        return {
            "privateKey": decodedPrivKeyPEM,
            "publicKey": decodedPubKeyPEM
        }
        
    @rsa_ns.doc(description='Delete the public RSA key',        
        responses={int(HTTPStatus.OK): "The public key was deleted"},
        security='CSRF')
    @jwt_required()
    def delete(self):
        '''Delete the public RSA key'''
        
        identity = get_jwt_identity()
        self.rsaKeysBroker.delete_by_user_id(identity["user_id"])
        
        message = f"Public key deleted"        
        return jsonify(status="success", message=message)