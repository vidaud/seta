
from Crypto.PublicKey import RSA
from flask import Blueprint, json, request
from flask_jwt_extended import jwt_required, get_jwt_identity

import infrastructure.constants as constants
from repository.interfaces import IRsaKeysBroker

from injector import inject

rsa = Blueprint("rsa", __name__)


@rsa.route("/generate-rsa-keys", methods=["POST"])
@jwt_required()
@inject
def generateRsaKeys(rsaKeyBroker: IRsaKeysBroker):

    #r = json.loads(request.data.decode("UTF-8"))
    #username = r["username"]
    identity = get_jwt_identity() 

    keyPair = RSA.generate(bits=4096)

    # public key
    pubKey = keyPair.publickey()
    pubKeyPEM = pubKey.exportKey()
    decodedPubKeyPEM = pubKeyPEM.decode('ascii')

    # private key
    privKeyPEM = keyPair.exportKey()
    decodedPrivKeyPEM = privKeyPEM.decode('ascii')

    rsaKeyBroker.set_rsa_key(identity["user_id"], decodedPubKeyPEM)

    response = {
        "authenticated": True,
        "status": "OK",
        "message": "RSA keys successfully generated",
        "privateKey": decodedPrivKeyPEM,
        "publicKey": decodedPubKeyPEM
    }

    return json.jsonify(response)

# GET - get the public RSA key
@rsa.route("/get-public-rsa-key/<username>")
@jwt_required()
@inject
def getPublicRsaKey(username, rsaKeyBroker: IRsaKeysBroker):
    identity = get_jwt_identity()
    key = rsaKeyBroker.get_rsa_key(identity["user_id"])
    
    #print("fetched key is:")
    #print(key)

    response = {
        "username": identity["user_id"],
        "is-rsa-key": True,
        "rsa-key-exists": True if key is not None else False,
        "value": key if key is not None else constants.defaultNoPublicKeyMessage
    }

    return json.jsonify(response)

@rsa.route("/delete-rsa-keys", methods=["POST"])
@jwt_required()
@inject
def deleteRsaKeys(rsaKeyBroker: IRsaKeysBroker):
    identity = get_jwt_identity()
    rsaKeyBroker.delete_by_user_id(identity["user_id"])

    response = {
        "status": "ok"
    }

    
    return json.jsonify(response)

    

    




