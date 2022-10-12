"""Initialize app extensions."""

from flask_apscheduler import APScheduler
from flask_jwt_extended import JWTManager

scheduler = APScheduler()
jwt = JWTManager()