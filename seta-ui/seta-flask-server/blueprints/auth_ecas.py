
from flask import Blueprint, abort
from flask import current_app as app
from flask import (redirect, request, make_response, url_for, session)

from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import set_access_cookies, set_refresh_cookies

from injector import inject
from repository.interfaces import IUsersBroker


auth_ecas = Blueprint("auth_ecas", __name__)

@auth_ecas.route('/login/', methods=["GET"])
@auth_ecas.route('/login/ecas', methods=["GET"])
def login():
    """
    ECAS authentication
    """
    
    #TODO: verify if user already logged in ?
    next = request.args.get("next")
      
    # No ticket, the request come from end user, send to CAS login
    app.cas_client.service_url = url_for('auth_ecas.login_callback_ecas', next=next, _external=True) #redirect to the same path after ECAS login
    cas_login_url = app.cas_client.get_login_url()
    app.logger.debug("CAS login URL: %s", cas_login_url)
    return redirect(cas_login_url)        
   
    
@auth_ecas.route('/login/callback/ecas', methods=["GET"])
@inject
def login_callback_ecas(userBroker: IUsersBroker):
    next = request.args.get("next")
    ticket = request.args.get("ticket")
    
     # There is a ticket, the request come from CAS as callback.
    # need call `verify_ticket()` to validate ticket and get user profile.
    app.logger.debug('ticket: %s', ticket)
    app.logger.debug('next: %s', next)
    
    user, attributes, pgtiou = app.cas_client.verify_ticket(ticket)
    
    app.logger.debug(
        'CAS verify ticket response: user: %s, attributes: %s, pgtiou: %s', user, attributes, pgtiou)
    
    if not user:
        abort(401, "Failed to verify ticket.")
    else:  # Login successful, redirect according to `next` query parameter. 
        #add db user from ecas result             
        usr = userBroker.get_user_by_username(attributes["uid"])
        if not usr:
            userBroker.add_user(attributes)
            usr = userBroker.get_user_by_username(attributes["uid"])
                 
        session["username"] = usr["username"]

        #additional_claims are added via additional_claims_loader method: factory->add_claims_to_access_token
        access_token = create_access_token(user, fresh=True)
        refresh_token = create_refresh_token(user)
        
        #TODO: verify 'next' domain before redirect, replace with home_route if anything suspicious
        if not next:
            next = app.home_route
            
        next = next + "?action=login"
                    
        response = make_response(redirect(next))
        
        #response.set_cookie('user_auth', user)
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)            
        
        return response

@auth_ecas.route("/logout/ecas")
def logout_ecas():
    redirect_url = url_for("auth.logout_callback", _external=True)
    cas_logout_url = app.cas_client.get_logout_url(redirect_url)
    app.logger.debug("CAS logout URL: %s", cas_logout_url)

    return redirect(cas_logout_url)