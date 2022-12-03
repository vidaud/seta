from flask import Blueprint, abort
from flask import current_app as app, g
from flask import (redirect, request, make_response, url_for, session)

from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import set_access_cookies, set_refresh_cookies

from infrastructure.extensions import github

from injector import inject
from repository.interfaces import IUsersBroker

auth_github = Blueprint("auth_github", __name__)

@auth_github.route('/login/github', methods=["GET"])
def login():
    """
    GITHUB authentication
    """
    next = request.args.get("next", None)
    
    return github.authorize(scope="read:user", redirect_uri=next)

@github.access_token_getter
def token_getter():
    user = g.user
    if user is not None:
        return user["github_access_token"]

@auth_github.route('/login/callback/github', methods=["GET"])
@github.authorized_handler
@inject
def login_callback_github(access_token, userBroker: IUsersBroker):    
    if access_token is None:
        abort(401, "Failed Github authorization.")
        
    usr = {"github_access_token": access_token}
    g.user = usr
    
    github_user = github.get('/user')
    
    app.logger.debug(str(github_user))
    
    username = github_user['login']
    name = str(github_user["name"]).split(maxsplit=1)
    first_name = name[0]
    if len(name) > 1:
        last_name = name[1]
    else:
        last_name = ""
    
    user = userBroker.get_user_by_username(username)
    if user is None:        
        user = {
            "uid": username,
            "first_name": first_name,
            "last_name": last_name,
            "email": github_user["email"],
            "domain": github_user["company"],
            "role": "user"
        }
        
        if github_user["email"] is not None and github_user["email"].lower() in app.config["ROOT_USERS"]:
            user["role"] = "admin"
        
        userBroker.add_user(user)
    else:
        if user["first_name"] != first_name:
            userBroker.update_user(username, "first_name", first_name)
        if user["last_name"] != first_name:
            userBroker.update_user(username, "last_name", last_name)
            
    session["username"] = username
    #additional_claims are added via additional_claims_loader method: factory->add_claims_to_access_token
    access_token = create_access_token(username, fresh=True)
    refresh_token = create_refresh_token(username)
    
    next = request.args.get("next")
    #TODO: verify 'next' domain before redirect, replace with home_route if anything suspicious
    if not next:
        next = app.home_route
        
    next = next + "?action=login"
                
    response = make_response(redirect(next))
    
    #response.set_cookie('user_auth', user)
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)            
    
    return response