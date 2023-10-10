"""Initialize app extensions."""

from seta_api.infrastructure.seta_jwt_manager import SetaJWTManager
from seta_api.infrastructure.log_setup import LogSetup

jwt = SetaJWTManager()
logs = LogSetup()