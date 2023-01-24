from flask import Blueprint
from flask import jsonify, abort, json, request
from flask_jwt_extended import decode_token
from flask_jwt_extended.exceptions import NoAuthorizationError
from flask import current_app as app

from repository.interfaces import IUsersBroker
from injector import inject

token_info = Blueprint("token_info", __name__)

@token_info.route("/token_info", methods=["POST"])
@inject
def decode_token_info(usersBroker: IUsersBroker):
    
    r = json.loads(request.data.decode("UTF-8"))
    token = r.get("token")
    
    if token is None:
        app.logger.error("No token provided")
        abort(404, "No token provided")
    
    #app.logger.debug("encoded_token: " + str(token))    
    decoded_token = None
    try:
        decoded_token = decode_token(token)
                
        #get user resource scopes
        seta_id = decoded_token.get("seta_id")
        if seta_id:
            user = usersBroker.get_user_by_id(seta_id["user_id"])
            

            decoded_token["resource_scopes"] = []
            if user is not None:
                if user.resource_scopes is not None:
                    decoded_token["resource_scopes"] = [obj.to_scope_json() for obj in user.resource_scopes]

                if user.system_scopes is not None:
                    for ss in user.system_scopes:
                        if ss.area.lower() == "resource":
                            decoded_token["resource_scopes"].add({"id": "_any_", "scope": ss.scope})

                #TODO: build readable scopes from the community membership and public resources
            

    except NoAuthorizationError as e:
        abort(401, str(e))
    
    app.logger.debug(decoded_token)
    return jsonify(decoded_token)
