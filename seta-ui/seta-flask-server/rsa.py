import binascii
from base64 import b64encode
from hashlib import sha512

from Crypto.Cipher import PKCS1_OAEP
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
from flask import Blueprint, json, request, session
from flask_jwt_extended import jwt_required

import constants
from auth import authenticateJwt
from db_config import getDb
from db_rsa_keys_broker import (deleteAllRsaKeysForUser, getDbRsaKey,
                                setDbRsaKey)

db = getDb()

rsa = Blueprint("rsa", __name__)


@rsa.route("/rsa/generate-rsa-keys", methods=["POST"])
@jwt_required()
def generateRsaKeys():

    r = json.loads(request.data.decode("UTF-8"))
    username = r["username"]
    # authentication = authenticateJwt(username)

    # if not authentication["authenticated"]:
    #     return authentication

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

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

# GET - get the public RSA key
@rsa.route("/rsa/get-public-rsa-key/<username>")
def getPublicRsaKey(username):
    # authentication = authenticateJwt(username)

    # if not authentication["authenticated"]:
    #     return authentication

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

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@rsa.route("/rsa/delete-rsa-keys", methods=["POST"])
@jwt_required()
def deleteRsaKeys():

    r = json.loads(request.data.decode("UTF-8"))
    username = r["username"]
    # authentication = authenticateJwt(username)

    # if not authentication["authenticated"]:
    #     return authentication

    deleteAllRsaKeysForUser(username)

    response = {
        "status": "ok"
    }

    response = json.jsonify(response)

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

    

    




