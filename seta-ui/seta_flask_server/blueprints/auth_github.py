from flask import Blueprint, abort
from flask import current_app as app, g
from flask import request, session

from urllib.parse import urljoin

from seta_flask_server.infrastructure.auth_helpers import create_login_response, validate_next_url
from seta_flask_server.infrastructure.extensions import github
from seta_flask_server.repository.interfaces import IUsersBroker, ISessionsBroker
from seta_flask_server.repository.models import SetaUserExt

from injector import inject
from flask_github import GitHubError

from http import HTTPStatus

auth_github = Blueprint("auth_github", __name__)

@auth_github.route('/login/github', methods=["GET"])
def login():
    """
    Redirect to GITHUB authentication page
    """
    next = request.args.get("redirect", None)
    session["redirect"] = next
    
    #! redirect uri must match the callback URL, so no other path is working
    return github.authorize(scope="read:user,user:email", redirect_uri=None)

@github.access_token_getter
def token_getter():
    user = g.user
    if user is not None:
        return user["github_access_token"]

@auth_github.route('/login/callback/github', methods=["GET"])
@github.authorized_handler
@inject
def login_callback_github(access_token, userBroker: IUsersBroker, sessionBroker: ISessionsBroker):
    """Callback after Github successful authentication"""
    
    if access_token is None:
        abort(HTTPStatus.UNAUTHORIZED, "Failed Github authorization.")
        
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
        
    seta_user = SetaUserExt.from_github_json(github_user)
    
    #next = request.args.get("next")
    next = session.get("redirect")        
   
    if not next or not validate_next_url(next):                        
        next = app.home_route

    next = urljoin(next, "?action=login")        
    
    auth_user = userBroker.authenticate_user(seta_user)
    
    if auth_user is None:
        #! user is not active
        abort(HTTPStatus.UNAUTHORIZED, "The user couldn't be authenticated")
    
    response = create_login_response(seta_user=auth_user, sessionBroker=sessionBroker, next=next)
        
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