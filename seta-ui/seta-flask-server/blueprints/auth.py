from datetime import datetime
from datetime import timedelta
from datetime import timezone

from flask import Blueprint
from flask import current_app as app
from flask import (jsonify, redirect, request, make_response, session)

from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, verify_jwt_in_request
from flask_jwt_extended import set_access_cookies, unset_jwt_cookies
from flask_jwt_extended import get_jwt_identity, get_jwt

auth = Blueprint("auth", __name__)
    
@auth.route('/logout/callback')
def logout_callback():
    """ 
    Redirect from CAS logout request after CAS logout successfully.
    """
    
    response = make_response(redirect(request.host_url + app.home_route))
    unset_jwt_cookies(response)
    return response

#@auth.route("/logout", methods=["POST","GET"])
@auth.route("/logout/", methods=["POST","GET"])
def logout_local():
    """
    Remove tokens from cookies, but third-party cookies will remain
    """
    session.pop("username", None)
    response = jsonify({"status": "success"})
    unset_jwt_cookies(response)
    return response


@auth.route('/refresh', methods=('POST',))
@jwt_required(refresh=True)
def refresh():
  username = get_jwt_identity()
  access_token = create_access_token(identity = username, fresh=False)

  response = jsonify({"status": "success"})
  set_access_cookies(response, access_token)

  return response

def refresh_expiring_jwts(response):
    try:
        token_expires = app.config['JWT_ACCESS_TOKEN_EXPIRES']
                
        if token_expires is None:
            app.logger.debug("set token_expires to 15 min")
            token_expires = timedelta(minutes=15)
                
        verify_result = verify_jwt_in_request(optional=True)
        if verify_result is not None:        
            exp_timestamp = get_jwt()["exp"]
            now = datetime.now(timezone.utc)        
                    
            expire_minutes = (token_expires.total_seconds() / 60) // 2
            delta = timedelta(minutes=expire_minutes)
            
            target_timestamp = datetime.timestamp(now + delta)
            if target_timestamp > exp_timestamp:
                            
                username = get_jwt_identity()
                
                access_token = create_access_token(identity=username, fresh=False)
                set_access_cookies(response, access_token)
                
                
                app.logger.debug("target_timestamp: " 
                            + str(datetime.fromtimestamp(target_timestamp)) 
                            + ", exp_timestamp: " 
                            + str(datetime.fromtimestamp(exp_timestamp)))
                app.logger.debug("Expiring access token was refreshed.")            
    except:
        # Case where there is not a valid JWT. Just return the original response
        app.logger.exception("Could not refresh the expiring token.")        
        return response
    finally:
        return response