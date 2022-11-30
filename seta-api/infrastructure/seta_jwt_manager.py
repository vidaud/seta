from calendar import timegm
import datetime
from json import JSONDecodeError
from flask_jwt_extended import JWTManager
from flask_jwt_extended.config import config
from flask_jwt_extended.exceptions import CSRFError
from flask_jwt_extended.exceptions import JWTDecodeError
from jwt import DecodeError, ExpiredSignatureError, InvalidAudienceError, MissingRequiredClaimError
import requests
from hmac import compare_digest
from flask import current_app

class SetaJWTManager(JWTManager):
    """
    Override _decode_jwt_from_config
    """
    def _decode_jwt_from_config(
        self, encoded_token: str, csrf_value=None, allow_expired: bool = False
    ) -> dict:              
        
        try:            
            url = current_app.config.get("JWT_TOKEN_INFO_URL")
            if url is None:
                return None
            headers = {"Content-Type": "application/json"}
            json = {"token": encoded_token}
            
            r = requests.post(url=url,json=json, headers=headers)
            decoded_token = r.json()
            
            current_app.logger.debug(decoded_token)
            
            #verification copied from flask_jwt_extended.tokens.py->_decode_token
            if config.identity_claim_key not in decoded_token:
                raise JWTDecodeError("Missing claim: {}".format(config.identity_claim_key))
            
            if "type" not in decoded_token:
                decoded_token["type"] = "access"

            if "fresh" not in decoded_token:
                decoded_token["fresh"] = False

            if "jti" not in decoded_token:
                decoded_token["jti"] = None
                
            if csrf_value:
                current_app.logger.debug("Verify csrf " + csrf_value)
                
                if "csrf" not in decoded_token:
                    raise JWTDecodeError("Missing claim: csrf")
                if not compare_digest(decoded_token["csrf"], csrf_value):
                    raise CSRFError("CSRF double submit tokens do not match")
            #end _decode_token verification
            
            return decoded_token
        except ConnectionError as ce:
            current_app.logger.exception(str(ce))
        except JSONDecodeError as je:
            current_app.logger.exception(str(je))
        except Exception as e:
            current_app.logger.exception(str(e))
            
        return None
            