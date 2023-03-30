from flask import current_app as app
from flask import Response, make_response, redirect

from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import set_access_cookies, set_refresh_cookies

from seta_flask_server.repository.models import SetaUser
from seta_flask_server.repository.interfaces import IUsersBroker
from .helpers import set_token_info_cookies

def create_login_response(seta_user: SetaUser, userBroker: IUsersBroker, next: str) -> Response:
    auth_user = userBroker.authenticate_user(seta_user)                
                
    #additional_claims are added via additional_claims_loader method: factory->add_claims_to_access_token
    identity = auth_user.to_identity_json()
    additional_claims = {
        "role": auth_user.role
    }
    
    access_token = create_access_token(identity, fresh=True, additional_claims=additional_claims)
    refresh_token = create_refresh_token(identity, additional_claims=additional_claims)
                
    response = make_response(redirect(next))
    
    #response.set_cookie('user_auth', user)
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)   
    set_token_info_cookies(response=response, access_token_encoded=access_token, refresh_token_encoded=refresh_token)
    
    return response