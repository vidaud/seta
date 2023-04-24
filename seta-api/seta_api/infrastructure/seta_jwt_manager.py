from calendar import timegm
from json import JSONDecodeError
from flask_jwt_extended import JWTManager
from flask_jwt_extended.config import config as jwt_config
from flask_jwt_extended.exceptions import CSRFError
from flask_jwt_extended.exceptions import JWTDecodeError
import requests
from hmac import compare_digest
from flask import Flask

class SetaJWTManager(JWTManager):
    
    token_info_url=None
    logger = None
    
    def init_app(self, app: Flask, add_context_processor: bool = False) -> None:
        super().init_app(app=app, add_context_processor=add_context_processor)
        self.token_info_url = app.config.get("JWT_TOKEN_INFO_URL")
    
    """
    Override _decode_jwt_from_config
    """
    def _decode_jwt_from_config(
        self, encoded_token: str, csrf_value=None, allow_expired: bool = False
    ) -> dict:              
        
        try:    
            if self.token_info_url is None:
                return None
            headers = {"Content-Type": "application/json"}
            json = {"token": encoded_token, "auth_area": ["resources"]}
            
            r = requests.post(url=self.token_info_url, json=json, headers=headers)
            decoded_token = r.json()            
            
            #verification copied from flask_jwt_extended.tokens.py->_decode_token
            if jwt_config.identity_claim_key not in decoded_token:
                raise JWTDecodeError("Missing claim: {}".format(jwt_config.identity_claim_key))
            
            if "type" not in decoded_token:
                decoded_token["type"] = "access"

            if "fresh" not in decoded_token:
                decoded_token["fresh"] = False

            if "jti" not in decoded_token:
                decoded_token["jti"] = None
                
            if csrf_value:                
                if "csrf" not in decoded_token:
                    raise JWTDecodeError("Missing claim: csrf")
                if not compare_digest(decoded_token["csrf"], csrf_value):
                    raise CSRFError("CSRF double submit tokens do not match")
            #end _decode_token verification
            
            return decoded_token
        except ConnectionError as ce:
            raise JWTDecodeError(str(ce))
        except JSONDecodeError as je:
            raise JWTDecodeError(str(je))
        except Exception as e:
            raise JWTDecodeError(str(e))            