from flask import Blueprint
from flask import jsonify, abort, json, request
from flask_jwt_extended import decode_token
from flask_jwt_extended.exceptions import NoAuthorizationError
from flask import current_app as app

token_info = Blueprint("token_info", __name__)

@token_info.route("/token_info", methods=["POST"])
def decode_token_info():
    
    r = json.loads(request.data.decode("UTF-8"))
    token = r.get("token")
    
    if token is None:
        app.logger.error("No token provided")
        abort(404, "No token provided")
    
    #app.logger.debug("encoded_token: " + str(token))    
    decoded_token = None
    try:
        decoded_token = decode_token(token)
        
        
        #TODO: get user resource scopes
        decoded_token["scopes"] = {"rid":"_all_public_", "scope":"/seta/resources/read/public"}
    except NoAuthorizationError as e:
        abort(401, str(e))
        
    return jsonify(decoded_token)