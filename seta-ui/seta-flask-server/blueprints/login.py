from datetime import datetime
from datetime import timedelta
from datetime import timezone

from flask import Blueprint
from flask import current_app as app
from flask import (jsonify, redirect, request, make_response, url_for)

from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import jwt_required
from flask_jwt_extended import set_access_cookies, set_refresh_cookies, unset_jwt_cookies
from flask_jwt_extended import get_jwt_identity, get_jwt

from db.db_users_broker import addDbUser, getDbUser

login_bp = Blueprint("login_bp", __name__, url_prefix="/seta-ui/v2")

@login_bp.route('/login', methods=["POST"])
def login():
    """
    ECAS authentication
    """
    
    #TODO: verify if user already logged in ?
        
    next = request.args.get("next")
    ticket = request.args.get("ticket")
    
    if not ticket:
        # No ticket, the request come from end user, send to CAS login
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
        if not getDbUser(attributes["uid"]):
            addDbUser(attributes)
            
        access_token = create_access_token(user, fresh=True)
        refresh_token = create_refresh_token(user)
        
        #TODO: verify 'next' domain before redirect, replace with home_route if anything suspicious
        if not next:
            next = app.home_route
        
        response = make_response(redirect(next))
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)            
        
        return response
   
@login_bp.route("/logout/ecas", methods=["POST"])
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
    
    response = make_response(redirect(app.home_route))
    unset_jwt_cookies(response)
    return response

@login_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout_local():
    """
    Remove tokens from cookies, but third-party cookies will remain
    """
    
    response = jsonify({"status": "success"})
    unset_jwt_cookies(response)
    return response

@login_bp.route("/user", methods=["GET"])
@jwt_required()
def user_details():
    identity = get_jwt_identity()
    user = getDbUser(identity)
    
    if not user:
        return jsonify({"message" : "User not found in the database!"}), 404
    
    return jsonify({
                    "username": user["username"], 
                    "first_name": user["first_name"], 
                    "last_name": user["last_name"], 
                    "email": user["email"]
                }), 200

'''
@login_bp.route('/refresh', methods=('POST',))
@jwt_required(refresh=True)
def refresh():
  username = get_jwt_identity()
  access_token = create_access_token(identity = username, fresh=False)

  response = jsonify()
  set_access_cookies(response, access_token)

  return response, 204
'''

@login_bp.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)        
        
        expire_minutes = app.config['JWT_ACCESS_TOKEN_EXPIRES'].total_minutes() // 2
        delta = timedelta(minutes=expire_minutes)
        
        target_timestamp = datetime.timestamp(now + delta)
        if target_timestamp > exp_timestamp:
            username = get_jwt_identity()
            
            access_token = create_access_token(identity=username, fresh=False)
            set_access_cookies(response, access_token)
            
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original response
        app.logger.warning("Could not refresh the expiring token.")
        return response