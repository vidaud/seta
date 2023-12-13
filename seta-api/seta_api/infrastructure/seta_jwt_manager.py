from hmac import compare_digest
from json import JSONDecodeError
import requests
from flask import Flask

from flask_jwt_extended import JWTManager
from flask_jwt_extended.config import config as jwt_config
from flask_jwt_extended.exceptions import CSRFError, NoAuthorizationError


class SetaJWTManager(JWTManager):
    token_info_url = None
    logger = None
    app: Flask = None

    def init_app(self, app: Flask, add_context_processor: bool = False) -> None:
        super().init_app(app=app, add_context_processor=add_context_processor)
        self.token_info_url = app.config.get("JWT_TOKEN_INFO_URL")
        self.app = app

    def _decode_jwt_from_config(
        self, encoded_token: str, csrf_value=None, allow_expired: bool = False
    ) -> dict:
        """Overrides _decode_jwt_from_config"""

        try:
            if self.token_info_url is None:
                return None
            headers = {"Content-Type": "application/json"}
            json = {"token": encoded_token, "authorizationAreas": ["data-sources"]}

            r = requests.post(
                url=self.token_info_url, json=json, headers=headers, timeout=30
            )
            decoded_token = r.json()

            # verification copied from flask_jwt_extended.tokens.py->_decode_token
            if jwt_config.identity_claim_key not in decoded_token:
                raise JSONDecodeError(
                    msg=f"Missing claim: {jwt_config.identity_claim_key}",
                    doc=decoded_token,
                    pos=0,
                )

            if "type" not in decoded_token:
                decoded_token["type"] = "access"

            if "fresh" not in decoded_token:
                decoded_token["fresh"] = False

            if "jti" not in decoded_token:
                decoded_token["jti"] = None

            if csrf_value:
                if "csrf" not in decoded_token:
                    raise CSRFError("Missing claim: csrf")
                if not compare_digest(decoded_token["csrf"], csrf_value):
                    raise CSRFError("CSRF double submit tokens do not match")
            # end _decode_token verification

            return decoded_token
        except ConnectionError as ce:
            self.app.logger.exception(ce)
            raise NoAuthorizationError() from ce
        except JSONDecodeError as je:
            self.app.logger.exception(je)
            raise NoAuthorizationError() from je
        except CSRFError:
            raise
        except Exception as e:
            self.app.logger.exception(e)
            raise NoAuthorizationError() from e
