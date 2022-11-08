from datetime import datetime
from datetime import timedelta
from datetime import timezone

from flask import Blueprint
from flask import current_app as app
from flask import (jsonify, redirect, request, make_response, url_for, session)

from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import jwt_required, verify_jwt_in_request
from flask_jwt_extended import set_access_cookies, set_refresh_cookies, unset_jwt_cookies
from flask_jwt_extended import get_jwt_identity, get_jwt

from db.db_users_broker import addDbUser, getDbUser
from urllib.parse import urlparse

login_bp = Blueprint("login_bp", __name__)

@login_bp.route('/login', methods=["GET"])
def login():
    """
    ECAS authentication
    """
    
    #TODO: verify if user already logged in ?
        
    next = request.args.get("next")
    ticket = request.args.get("ticket")
    
    if not ticket:
        # No ticket, the request come from end user, send to CAS login
        app.cas_client.service_url = request.url #redirect to the same path after ECAS login
        cas_login_url = app.cas_client.get_login_url()
        app.logger.debug("CAS login URL: %s", cas_login_url)
        return redirect(cas_login_url)
        
    # There is a ticket, the request come from CAS as callback.
    # need call `verify_ticket()` to validate ticket and get user profile.
    app.logger.debug('ticket: %s', ticket)
    app.logger.debug('next: %s', next)
    
    user, attributes, pgtiou = app.cas_client.verify_ticket(ticket)
    
    app.logger.debug(
        'CAS verify ticket response: user: %s, attributes: %s, pgtiou: %s', user, attributes, pgtiou)
    
    if not user:
        return jsonify({"message": "Failed to verify ticket."}), 401
    else:  # Login successful, redirect according to `next` query parameter.              
        usr = getDbUser(attributes["uid"])
        if not usr:
            addDbUser(attributes)
            usr = getDbUser(attributes["uid"])
                 
        session["username"] = usr["username"]

        #additional_claims are added via additional_claims_loader method: factory->add_claims_to_access_token
        access_token = create_access_token(user, fresh=True)
        refresh_token = create_refresh_token(user)
        
        #TODO: verify 'next' domain before redirect, replace with home_route if anything suspicious
        if not next:
            next = request.host_url + app.home_route
            
        next = next + "?action=login"
                    
        response = make_response(redirect(next))
        
        #response.set_cookie('user_auth', user)
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)            
        
        return response
   
@login_bp.route("/logout/ecas", methods=["GET"])
@jwt_required()
def logout_ecas():
    """
    Redirect to ECAS for logout, i.e. remove ECAS cookie and then redirect back to /logout_callback
    """
    
    redirect_url = url_for('login.logout_callback', _external=True)
    cas_logout_url = app.cas_client.get_logout_url(redirect_url)
    app.logger.debug('CAS logout URL: %s', cas_logout_url)

    return redirect(cas_logout_url)
    
@login_bp.route('/logout_callback')
def logout_callback():
    """ 
    Redirect from CAS logout request after CAS logout successfully.
    """
    
    response = make_response(redirect(request.host_url + app.home_route))
    unset_jwt_cookies(response)
    return response

@login_bp.route("/logout", methods=["POST","GET"])
def logout_local():
    """
    Remove tokens from cookies, but third-party cookies will remain
    """
    
    response = jsonify({"status": "success"})
    unset_jwt_cookies(response)
    return response

@login_bp.route("/user-info", methods=["GET"])
@jwt_required()
def user_details():
    """ Returns json with user details"""
    
    identity = get_jwt_identity()
    user = getDbUser(identity)
    
    if not user:
        return jsonify({"message" : "User not found in the database!"}), 404
    
    role = "user"
    if "role" in user:
        role = user["role"]
    return jsonify({
                    "username": user["username"], 
                    "firstName": user["first_name"], 
                    "lastName": user["last_name"], 
                    "email": user["email"],
                    "role": role
                }), 200


@login_bp.route('/refresh', methods=('POST',))
@jwt_required(refresh=True)
def refresh():
  username = get_jwt_identity()
  usr = getDbUser(username)
  additional_claims = {"role": usr["role"]} 
  access_token = create_access_token(identity = username, fresh=False, additional_claims=additional_claims)

  response = jsonify()
  set_access_cookies(response, access_token)

  return response, 204

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
                
                usr = getDbUser(username)    
                additional_claims = {"role": usr["role"]} 
                access_token = create_access_token(identity=username, fresh=False, additional_claims=additional_claims)
                set_access_cookies(response, access_token)
                
                
                app.logger.debug("target_timestamp: " 
                            + str(datetime.fromtimestamp(target_timestamp)) 
                            + ", exp_timestamp: " 
                            + str(datetime.fromtimestamp(exp_timestamp)))
                app.logger.debug("Expiring access token was refreshed.")            
    except:
        # Case where there is not a valid JWT. Just return the original response
        app.logger.exception("Could not refresh the expiring token.")        
    finally:
        return response
