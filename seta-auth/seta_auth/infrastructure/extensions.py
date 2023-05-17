"""Initialize app extensions."""

from flask_jwt_extended import JWTManager
from .log_setup import LogSetup

jwt = JWTManager()
logs = LogSetup()