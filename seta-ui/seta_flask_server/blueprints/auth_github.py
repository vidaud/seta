from flask import Blueprint, abort
from flask import current_app as app, g
from flask import (redirect, request, make_response, url_for)

from urllib.parse import urljoin

from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import set_access_cookies, set_refresh_cookies

from seta_flask_server.infrastructure.helpers import set_token_info_cookies
from seta_flask_server.infrastructure.extensions import github
from seta_flask_server.repository.interfaces import IUsersBroker
from seta_flask_server.repository.models import SetaUser

from injector import inject
from flask_github import GitHubError

auth_github = Blueprint("auth_github", __name__)

@auth_github.route('/login/github', methods=["GET"])
def login():
    """
    Redirect to GITHUB authentication page
    """
    next = request.args.get("next", None)
    
    return github.authorize(scope="read:user,user:email", redirect_uri=next)

@github.access_token_getter
def token_getter():
    user = g.user
    if user is not None:
        return user["github_access_token"]

@auth_github.route('/login/callback/github', methods=["GET"])
@github.authorized_handler
@inject
def login_callback_github(access_token, userBroker: IUsersBroker):
    """Callback after Github successful authentication"""
    
    if access_token is None:
        abort(401, "Failed Github authorization.")
        
    usr = {"github_access_token": access_token}
    g.user = usr
    
    github_user = github.get('/user')
    
    app.logger.debug(str(github_user))
        
    if github_user["email"] is None:
        github_user["email"] = _get_user_email()        
            
    #set dummy email
    if github_user["email"] is None:
        github_user["email"] = github_user["login"] + "_no_reply@github.com"
        
    admins = app.config["ROOT_USERS"]
    email = str(github_user["email"]).lower()
    github_user["is_admin"] = email in admins
        
    seta_user = SetaUser.from_github_json(github_user)
    auth_user = userBroker.authenticate_user(seta_user)    
                        
    #additional_claims are added via additional_claims_loader method: factory->add_claims_to_access_token    
    identity = auth_user.to_identity_json()
    additional_claims = {
            "role": auth_user.role
        }
    
    access_token = create_access_token(identity, fresh=True, additional_claims=additional_claims)
    refresh_token = create_refresh_token(identity, additional_claims=additional_claims)
    
    next = request.args.get("next")
    #TODO: verify 'next' domain before redirect, replace with home_route if anything suspicious
    if not next:
        next = app.home_route
        
    next = urljoin(next, "?action=login")
                
    response = make_response(redirect(next))
    
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)
    set_token_info_cookies(response=response, access_token_encoded=access_token, refresh_token_encoded=refresh_token)
    
    return response

def _get_user_email() -> str:
    """Perform a GET request to retrieve the user email from Github"""
    
    try:
        #emails = github.get("/user/emails", headers={'Accept':'application/vnd.github+json'})
        emails = github.get("/user/emails")
        app.logger.debug(str(emails))
        
        if len(emails) > 0:
            for e in emails:
                if e["primary"]:
                    return e["email"]
                
            return emails[0]["email"]                
    except GitHubError as ge:
        app.logger.exception(str(ge))        
        
    return None