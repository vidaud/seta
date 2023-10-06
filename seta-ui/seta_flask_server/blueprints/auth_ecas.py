from flask import Blueprint, abort
from flask import current_app as app
from flask import (redirect, request, url_for)

from seta_flask_server.infrastructure.auth_helpers import create_login_response, validate_next_url
from seta_flask_server.repository.interfaces import IUsersBroker, ISessionsBroker
from seta_flask_server.repository.models import SetaUserExt

from urllib.parse import urljoin

from injector import inject
from http import HTTPStatus


auth_ecas = Blueprint("auth_ecas", __name__)

@auth_ecas.route('/login/', methods=["GET"])
@auth_ecas.route('/login/ecas', methods=["GET"])
def login():
    """
    Redirects to ECAS authentication page
    """
    
    next = request.args.get("redirect")
    app.logger.debug('next: %s', next)
      
    # No ticket, the request come from end user, send to CAS login
    app.cas_client.service_url = url_for('auth_ecas.login_callback_ecas', next=next, _external=True) #redirect to the same path after ECAS login
    cas_login_url = app.cas_client.get_login_url()
    
    app.logger.debug("CAS login URL: %s", cas_login_url)
    
    return redirect(cas_login_url)        
   
@auth_ecas.route('/login/callback/ecas', methods=["GET"])
@inject
def login_callback_ecas(userBroker: IUsersBroker, sessionBroker: ISessionsBroker):
    """ Callback after ECAS successful authentication """
    
    next = request.args.get("next")
    ticket = request.args.get("ticket")
    
    # There is a ticket, the request come from CAS as callback.
    # need call `verify_ticket()` to validate ticket and get user profile.
    app.logger.debug('ticket: %s', ticket)
    app.logger.debug('next: %s', next)
    
    try:
        user, attributes, pgtiou = app.cas_client.verify_ticket(ticket)
    except:
        app.logger.exception("Failed to verify ticket.")
        abort(HTTPStatus.UNAUTHORIZED, "Failed to verify ticket.")
    
    app.logger.debug('CAS verify ticket response: user: %s, attributes: %s, pgtiou: %s', user, attributes, pgtiou)
    
    if not user:
        abort(HTTPStatus.UNAUTHORIZED, "Failed to verify ticket.")
    
    # Login successful, redirect according to `next` query parameter. 
    admins = app.config.get("ROOT_USERS", [])
    email = str(attributes["email"]).lower()
    attributes["is_admin"] = email in admins
    
    seta_user = SetaUserExt.from_ecas_json(attributes)
    
    if not next or not validate_next_url(next):                        
        next = app.home_route
        
    next = urljoin(next, "?action=login")
    
    auth_user = userBroker.authenticate_user(seta_user)
    
    if auth_user is None:
        #! user is not active
        return redirect(app.home_route)
        abort(HTTPStatus.UNAUTHORIZED, "The user couldn't be authenticated")
    
    response = create_login_response(seta_user=auth_user, sessionBroker=sessionBroker, next=next)
    
    return response

@auth_ecas.route("/logout/ecas")
def logout_ecas():
    """Redirect to ECAS logout page"""
    
    redirect_url = url_for("auth._seta_logout_callback", _external=True)
    cas_logout_url = app.cas_client.get_logout_url(redirect_url)
    
    app.logger.debug("CAS logout URL: %s", cas_logout_url)

    return redirect(cas_logout_url)
