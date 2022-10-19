
from Crypto.PublicKey import RSA
from flask import Blueprint, json, request
from flask_jwt_extended import jwt_required

import infrastructure.constants as constants
from db.db_rsa_keys_broker import (deleteAllRsaKeysForUser, getDbRsaKey,
                                setDbRsaKey)

rsa = Blueprint("rsa", __name__)


@rsa.route("/rsa/generate-rsa-keys", methods=["POST"])
@jwt_required()
def generateRsaKeys():

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

    setDbRsaKey(username, False, decodedPubKeyPEM)
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
@rsa.route("/rsa/get-public-rsa-key/<username>")
def getPublicRsaKey(username):

    key = getDbRsaKey(username, True)
    
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

@rsa.route("/rsa/delete-rsa-keys", methods=["POST"])
@jwt_required()
def deleteRsaKeys():

    r = json.loads(request.data.decode("UTF-8"))
    username = r["username"]

    deleteAllRsaKeysForUser(username)

    response = {
        "status": "ok"
    }

    response = json.jsonify(response)
    return response

    

    




