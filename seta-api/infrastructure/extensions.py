"""Initialize app extensions."""

from flask_apscheduler import APScheduler
from infrastructure.seta_jwt_manager import SetaJWTManager
#from flask_jwt_extended import JWTManager
from infrastructure.log_setup import LogSetup

scheduler = APScheduler()
#jwt = JWTManager()
jwt = SetaJWTManager()
logs = LogSetup()