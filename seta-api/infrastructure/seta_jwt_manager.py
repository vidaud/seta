from json import JSONDecodeError
from flask_jwt_extended import JWTManager
from flask_jwt_extended.config import config
import requests
import jwt
from jwt import ExpiredSignatureError
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
            response_json = r.json()
            
            current_app.logger.debug(response_json)
            return response_json
        except ConnectionError as ce:
            current_app.logger.exception(str(ce))
        except JSONDecodeError as je:
            current_app.logger.exception(str(je))
        except Exception as e:
            current_app.logger.exception(str(e))
            
        return None
            