from bson import json_util, SON
from flask import json as flask_json
from six import iteritems, string_types
from bson.json_util import RELAXED_JSON_OPTIONS
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
import binascii

from datetime import datetime
from flask import current_app
from flask import url_for, Response
from flask_jwt_extended import decode_token, verify_jwt_in_request
from flask_jwt_extended.config import config as jwt_config

from infrastructure.constants import ExternalProviderConstants

class JSONEncoder(flask_json.JSONEncoder):

    """A JSON encoder that uses :mod:`bson.json_util` for MongoDB documents. """

    def __init__(self, json_options=None, *args, **kwargs):
        if json_options is None:
            json_options = RELAXED_JSON_OPTIONS
        if json_options is not None:
            self._default_kwargs = {"json_options": json_options}
        else:
            self._default_kwargs = {}

        super(JSONEncoder, self).__init__(*args, **kwargs)

    def default(self, obj):
        if hasattr(obj, "iteritems") or hasattr(obj, "items"):
            return SON((k, self.default(v)) for k, v in iteritems(obj))
        elif hasattr(obj, "__iter__") and not isinstance(obj, string_types):
            return [self.default(v) for v in obj]
        else:
            try:
                return json_util.default(obj, **self._default_kwargs)
            except TypeError:
                return obj
            
'''
from bson import ObjectId, datetime

class JSONEncoder(flask_json.JSONEncoder):
    """extend json-encoder class"""

    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime.datetime):
            return str(o)
        return json.JSONEncoder.default(self, o)
'''     

def validate_public_key(public, message, signature):
    try:
        public_key = RSA.import_key(public)
        digest = SHA256.new(message.encode())
        pkcs1_15.new(public_key).verify(digest, binascii.unhexlify(signature))
    except Exception as e:
        return False
    return True
    
def set_app_cookie(
    response: Response, key: str, value: str, max_age=None, domain=None
) -> None:
    """
    Modifiy a Flask Response to set a cookie containing a string value.

    :param response:
        A Flask Response object.
        
    :param key:
        The cookie key.

    :param value:
        The value to set in the cookie.

    :param max_age:
        The max age of the cookie. If this is None, it will use the
        ``JWT_SESSION_COOKIE`` option (see :ref:`Configuration Options`). Otherwise,
        it will use this as the cookies ``max-age`` and the JWT_SESSION_COOKIE option
        will be ignored. Values should be the number of seconds (as an integer).

    :param domain:
        The domain of the cookie. If this is None, it will use the
        ``JWT_COOKIE_DOMAIN`` option (see :ref:`Configuration Options`). Otherwise,
        it will use this as the cookies ``domain`` and the JWT_COOKIE_DOMAIN option
        will be ignored.
    """
    response.set_cookie(
            key=key,
            value=value,
            max_age=max_age or jwt_config.cookie_max_age,
            secure=jwt_config.cookie_secure,
            httponly=False,
            domain=domain or jwt_config.cookie_domain,
            path=jwt_config.access_csrf_cookie_path,
            samesite=jwt_config.cookie_samesite,
        )
    
def unset_app_cookie(response: Response, key: str,  domain: str = None) -> None:
    """
    Modifiy a Flask Response to delete the cookie with key ``key``.
    
    :param response:
        A Flask Response object
        
    :param key:
        The cookie key.

    :param domain:
        The domain of the cookie. If this is None, it will use the
        ``JWT_COOKIE_DOMAIN`` option (see :ref:`Configuration Options`). Otherwise,
        it will use this as the cookies ``domain`` and the JWT_COOKIE_DOMAIN option
        will be ignored.
    """
    response.set_cookie(
        key,
        value="",
        expires=0,
        secure=jwt_config.cookie_secure,
        httponly=True,
        domain=domain or jwt_config.cookie_domain,
        path=jwt_config.access_cookie_path,
        samesite=jwt_config.cookie_samesite,
    )
    
def set_token_info_cookies(response: Response, access_token_encoded: str, refresh_token_encoded: str = None):   
    '''
    Set cookies for access and refresh tokens UNIX timestamp for expiration
    
    :param response:
        A Flask Response object
        
    :param access_token_encoded:
        The encoded access JWT.
        
    :param refresh_token_encoded:
        The encoded refresh JWT. If ``None``, then ``verify_jwt_in_request`` is used to extract data for refresh token
    '''
    
    access_exp_timestamp = None
    refresh_exp_timestamp = None
    
    decoded_access_token = decode_token(access_token_encoded, allow_expired=True)
    access_exp_timestamp = decoded_access_token["exp"]
    
    if refresh_token_encoded is None:
        rjwt_header, rjwt_data = verify_jwt_in_request(refresh=True, optional=True)
        if rjwt_data is not None:
            refresh_exp_timestamp = rjwt_data["exp"]            
        
    else:
        decoded_refresh_token = decode_token(refresh_token_encoded, allow_expired=True)
        refresh_exp_timestamp = decoded_refresh_token["exp"]
        
    set_app_cookie(response=response, key="access_expire_cookie", value=str(access_exp_timestamp))
    set_app_cookie(response=response, key="refresh_expire_cookie", value=str(refresh_exp_timestamp))
    
def unset_token_info_cookies(response: Response):
    '''Unset ``access_expire_cookie`` & ``refresh_expire_cookie`` application cookies '''
    
    unset_app_cookie(response=response, key="access_expire_cookie")
    unset_app_cookie(response=response, key="refresh_expire_cookie")