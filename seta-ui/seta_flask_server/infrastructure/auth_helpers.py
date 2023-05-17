import pytz
import shortuuid

from datetime import datetime
from datetime import timedelta
from datetime import timezone

from flask import Response, make_response, redirect, session

from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import set_access_cookies, set_refresh_cookies
from flask_jwt_extended import decode_token, get_jwt, get_jwt_identity

from seta_flask_server.repository.models import SetaUser, UserSession, SessionToken
from seta_flask_server.repository.interfaces import ISessionsBroker
from .helpers import set_token_info_cookies

def refresh_expiring_jwts(app, response):
    new_access_token = None
    
    try:
        token_expires = app.config['JWT_ACCESS_TOKEN_EXPIRES']
                
        if token_expires is None:
            app.logger.debug("set token_expires to 15 min")
            token_expires = timedelta(minutes=15)
                
        jwt = get_jwt()      
        exp_timestamp = jwt["exp"]
        now = datetime.now(timezone.utc)        
        
        #refresh any token that is within the second half of its expiration time
        expire_minutes = (token_expires.total_seconds() / 60) // 2
        delta = timedelta(minutes=expire_minutes)
        
        target_timestamp = datetime.timestamp(now + delta)     

        #app.logger.debug("Refresh token only if " + str(target_timestamp) + " > " + str(exp_timestamp))

        if target_timestamp > exp_timestamp:
                        
            identity = get_jwt_identity()
            additional_claims = None
            role = jwt.get("role", None)
            if role is not None:
                additional_claims = {"role": role}
            
            new_access_token = create_access_token(identity=identity, fresh=False, additional_claims=additional_claims)
            set_access_cookies(response, new_access_token)
            set_token_info_cookies(response=response, access_token_encoded=new_access_token)
            
            '''
            app.logger.debug("target_timestamp: " 
                        + str(datetime.fromtimestamp(target_timestamp)) 
                        + ", exp_timestamp: " 
                        + str(datetime.fromtimestamp(exp_timestamp)))
            '''
            app.logger.debug("Expiring access token was refreshed.")            
    except Exception as e:
        # Case where there is not a valid JWT. Just return the original response
        app.logger.exception("Could not refresh the expiring token.")        
        return response, new_access_token
    finally:
        return response, new_access_token

def create_login_response(seta_user: SetaUser, sessionBroker: ISessionsBroker, next: str) -> Response:
    '''
    Common part after third-party succesful authentication
    
    :param auth_user:
        The SetaUser object created after third-party response
        
    :param userBroker:
        The user broker for database query
    
    :param next:
        Next url redirect
    '''
                    
    #additional_claims are added via additional_claims_loader method: factory->add_claims_to_access_token
    identity = seta_user.to_identity_json()
    additional_claims = {
        "role": seta_user.role
    }
    
    access_token = create_access_token(identity, fresh=True, additional_claims=additional_claims)
    refresh_token = create_refresh_token(identity, additional_claims=additional_claims)
    
    user_session = _create_session(seta_user=seta_user, access_token=access_token, refresh_token=refresh_token)
    sessionBroker.session_create(user_session)
                
    response = make_response(redirect(next))
    
    session["session_id"] = user_session.session_id
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)   
    set_token_info_cookies(response=response, access_token_encoded=access_token, refresh_token_encoded=refresh_token)  
    
    return response

def create_session_token(session_id: str, token: str, now: datetime = None) -> SessionToken:
    
    if now is None:
        now = datetime.now(tz=pytz.utc)
    
    dat = decode_token(token, allow_expired=True)    
    return SessionToken(session_id=session_id,
                      token_jti=dat["jti"],
                      token_type=dat["type"],
                      expires_at = datetime.fromtimestamp(dat["exp"], tz=pytz.utc),
                      created_at=now)

def _create_session(seta_user: SetaUser, access_token: str, refresh_token: str) -> UserSession:
    now = datetime.now(tz=pytz.utc)
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
      
    at = create_session_token(session_id=session_id, token=access_token, now=now)     
    rt = create_session_token(session_id=session_id, token=refresh_token, now=now)    
    
    user_session.session_tokens = [rt, at]
    
    return user_session