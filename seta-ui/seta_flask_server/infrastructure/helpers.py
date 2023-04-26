from bson import json_util, SON
from flask import json as flask_json, Flask
from six import iteritems, string_types
from bson.json_util import RELAXED_JSON_OPTIONS
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
import binascii
import typing as t

from flask import Response
from flask.json.provider import JSONProvider, _default
from flask_jwt_extended import decode_token, verify_jwt_in_request
from flask_jwt_extended.config import config as jwt_config
from functools import reduce

class MongodbJSONProvider(JSONProvider):
    def __init__(self, app: Flask) -> None:
        super().__init__(app)

    default: t.Callable[[t.Any], t.Any] = staticmethod(
        _default
    )

    def dumps(self, obj, **kwargs) -> str:
        """Serialize data as JSON.

        :param obj: The data to serialize.
        :param kwargs: May be passed to the underlying JSON library.
        """
        kwargs.setdefault("default", self.default)
        kwargs.setdefault("ensure_ascii", True)
        kwargs.setdefault("sort_keys", True)
        return json_util.dumps(obj, **kwargs)

    def loads(self, s, **kwargs):
        """Deserialize data as JSON.

        :param s: Text or UTF-8 bytes.
        :param kwargs: May be passed to the underlying JSON library.
        """
        return json_util.loads(s, **kwargs)
    

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
    
def join_slash(a, b):
    return a.rstrip('/') + '/' + b.lstrip('/')

def urljoin_segments(*args):
    return reduce(join_slash, args) if args else ''