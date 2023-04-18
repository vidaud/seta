from flask import Blueprint, json, request, abort, jsonify
from flask import current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity

from seta_flask_server.repository.interfaces import IUsersBroker, IRsaKeysBroker
import seta_flask_server.infrastructure.constants as constants

from injector import inject
from Crypto.PublicKey import RSA

profile = Blueprint("profile", __name__)

@profile.route("/user/delete", methods=["POST"])
@jwt_required()
@inject
def deleteUserAccount(userBroker: IUsersBroker):
    identity = get_jwt_identity()
    
    user = userBroker.get_user_by_id(identity["user_id"])

    if user is None:
        app.logger.warning("User not found in DB")

        response = {
            "authenticated": True,
            "status": "error",
            "message": "User not found in DB."
        }
    else:
        #TODO: discuss user archiving
        #userBroker.move_documents("users", "archive", {"user_id": user.user_id})
        
        response = {
            "authenticated": True,
            "status": "OK",
            "message":
            "All user data successfully deleted.",
            "user_id": user.user_id
        }
    
    return jsonify(response)

@profile.route("/user-info", methods=["GET"])
@jwt_required()
@inject
def user_details(usersBroker: IUsersBroker):
    """ Returns json with user details"""
    
    identity = get_jwt_identity()    
    user = usersBroker.get_user_by_id_and_provider(user_id=identity["user_id"], provider_uid=identity["provider_uid"], provider=identity["provider"])
    
    if user is None:
        app.logger.error(f"User {str(identity)} not found in the database!")
        abort(404, "User not found in the database!")

    return jsonify({
            "username": user.user_id, 
            "firstName": user.authenticated_provider.first_name, 
            "lastName": user.authenticated_provider.last_name,
            "email": user.email,
            "role": user.role
            })
    
@profile.route("/generate-rsa-keys", methods=["POST"])
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
@profile.route("/get-public-rsa-key")
@jwt_required()
@inject
def getPublicRsaKey(rsaKeyBroker: IRsaKeysBroker):
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

@profile.route("/delete-rsa-keys", methods=["POST"])
@jwt_required()
@inject
def deleteRsaKeys(rsaKeyBroker: IRsaKeysBroker):
    identity = get_jwt_identity()
    rsaKeyBroker.delete_by_user_id(identity["user_id"])

    response = {
        "status": "ok"
    }

    
    return json.jsonify(response)    