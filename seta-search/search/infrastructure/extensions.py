"""Initialize app extensions."""

from search.infrastructure.seta_jwt_manager import SetaJWTManager
from search.infrastructure.log_setup import LogSetup

jwt = SetaJWTManager()
logs = LogSetup()