"""Initialize app extensions."""

#from flask_apscheduler import APScheduler
from seta_api.infrastructure.seta_jwt_manager import SetaJWTManager
from seta_api.infrastructure.log_setup import LogSetup

#scheduler = APScheduler()
#jwt = JWTManager()
jwt = SetaJWTManager()
logs = LogSetup()