
from Crypto.PublicKey import RSA
from flask import Blueprint, json, request
from flask import current_app as app
from flask_jwt_extended import jwt_required

import infrastructure.constants as constants
from repository.interfaces import IRsaKeysBroker

from injector import inject

rsa = Blueprint("rsa", __name__)


@rsa.route("/generate-rsa-keys", methods=["POST"])
@jwt_required()
@inject
def generateRsaKeys(rsaKeyBroker: IRsaKeysBroker):

    r = json.loads(request.data.decode("UTF-8"))
    username = r["username"]

    keyPair = RSA.generate(bits=4096)

    # public key
    pubKey = keyPair.publickey()
    pubKeyPEM = pubKey.exportKey()
    decodedPubKeyPEM = pubKeyPEM.decode('ascii')

    # private key
    privKeyPEM = keyPair.exportKey()
    decodedPrivKeyPEM = privKeyPEM.decode('ascii')

    rsaKeyBroker.set_rsa_key(username, False, decodedPubKeyPEM)
    # setDbRsaKey(username, True, decodedPrivKeyPEM)

    response = {
        "authenticated": True,
        "status": "OK",
        "message": "RSA keys successfully generated",
        "privateKey": decodedPrivKeyPEM,
        "publicKey": decodedPubKeyPEM
    }

    response = json.jsonify(response)
    return response

# GET - get the public RSA key
@jwt_required()
@inject
@rsa.route("/get-public-rsa-key/<username>")
def getPublicRsaKey(username, rsaKeyBroker: IRsaKeysBroker):
    key = rsaKeyBroker.get_rsa_key(username, True)
    
    #print("fetched key is:")
    #print(key)

    response = {
        "username": username,
        "is-rsa-key": True,
        "rsa-key-exists": True if key is not None else False,
        "value": key['value'] if key is not None else constants.defaultNoPublicKeyMessage
    }

    response = json.jsonify(response)
    return response

@rsa.route("/delete-rsa-keys", methods=["POST"])
@jwt_required()
@inject
def deleteRsaKeys(rsaKeyBroker: IRsaKeysBroker):

    r = json.loads(request.data.decode("UTF-8"))
    username = r["username"]

    rsaKeyBroker.delete_by_username(username)

    response = {
        "status": "ok"
    }

    response = json.jsonify(response)
    return response

    

    




