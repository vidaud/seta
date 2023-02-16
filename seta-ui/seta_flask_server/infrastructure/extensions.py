"""Initialize app extensions."""

from flask_apscheduler import APScheduler
from flask_jwt_extended import JWTManager
from .log_setup import LogSetup
from flask_github import GitHub

scheduler = APScheduler()
jwt = JWTManager()
logs = LogSetup()
github = GitHub()