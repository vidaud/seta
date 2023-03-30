import pytz
import shortuuid
import datetime

from flask import Response, make_response, redirect, session

from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import set_access_cookies, set_refresh_cookies
from flask_jwt_extended import decode_token

from seta_flask_server.repository.models import SetaUser, UserSession, SessionToken
from seta_flask_server.repository.interfaces import IUsersBroker
from .helpers import set_token_info_cookies

def create_login_response(seta_user: SetaUser, userBroker: IUsersBroker, next: str) -> Response:
    '''
    Common part after third-party succesful authentication
    
    :param seta_user:
        The SetaUser object created after third-party response
        
    :param userBroker:
        The user broker for database query
    
    :param next:
        Next url redirect
    '''
    
    auth_user = userBroker.authenticate_user(seta_user)                
                
    #additional_claims are added via additional_claims_loader method: factory->add_claims_to_access_token
    identity = auth_user.to_identity_json()
    additional_claims = {
        "role": auth_user.role
    }
    
    access_token = create_access_token(identity, fresh=True, additional_claims=additional_claims)
    refresh_token = create_refresh_token(identity, additional_claims=additional_claims)
    
    user_session = _create_session(seta_user=seta_user, access_token=access_token, refresh_token=refresh_token)
    userBroker.session_create(user_session)
                
    response = make_response(redirect(next))
    
    session["session_id"] = user_session.session_id
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)   
    set_token_info_cookies(response=response, access_token_encoded=access_token, refresh_token_encoded=refresh_token)  
    
    return response

def _create_session(seta_user: SetaUser, access_token: str, refresh_token: str) -> UserSession:
    now = datetime.datetime.now(tz=pytz.utc)
    session_id = shortuuid.ShortUUID().random(length=24) 
    
    user_session = UserSession(
        session_id = session_id,
        user_id=seta_user.user_id,
        created_at= now)
    
    if seta_user.authenticated_provider is not None:
        user_session.authenticated_provider = {
            "provider_uid": seta_user.authenticated_provider.provider_uid,
            "provider": seta_user.authenticated_provider.provider,
        }
    
    dat = decode_token(access_token, allow_expired=True)    
    at = SessionToken(session_id=session_id,
                      token_jti=dat["jti"],
                      token_type=dat["type"],
                      expires_at = datetime.datetime.fromtimestamp(dat["exp"], tz=pytz.utc),
                      created_at=now)
    
    drt = decode_token(refresh_token, allow_expired=True)    
    rt = SessionToken(session_id=session_id,
                      token_jti=drt["jti"],
                      token_type=drt["type"],
                      expires_at = datetime.datetime.fromtimestamp(drt["exp"], tz=pytz.utc),
                      created_at=now)
    
    
    user_session.session_tokens = [rt, at]
    
    return user_session