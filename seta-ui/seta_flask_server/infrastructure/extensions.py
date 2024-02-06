"""Initialize app extensions."""

from flask_migrate import Migrate
from flask_apscheduler import APScheduler
from flask_jwt_extended import JWTManager
from flask_github import GitHub
from flask_sqlalchemy import SQLAlchemy
from .log_setup import LogSetup

scheduler = APScheduler()
jwt = JWTManager()
logs = LogSetup()
github = GitHub()
db = SQLAlchemy()
migrate = Migrate()
