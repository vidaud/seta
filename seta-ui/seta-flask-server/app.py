import os
import time

from bson import ObjectId, datetime
from cas import CASClient
from flask import (Flask, Response, g, json, redirect, render_template,
                   request, send_from_directory, session, url_for)
from flask_apscheduler import APScheduler, scheduler
from flask_cors import CORS
from flask_jwt_extended import JWTManager, decode_token, get_jwt_identity
from flask_jwt_extended.view_decorators import jwt_required

import config

from db.db_revoked_tokens_broker import (deleteRevokedTokens, isTokenRevoked)
from db.db_users_broker import (deleteUserDataOlderThanThreeWeeks, getDbUser)

from blueprints.base_routes import base_routes
from blueprints.ecas import ecas
from blueprints.rest import rest
from blueprints.rsa import rsa

from log_utils.api_log import ApiLog
from log_utils.log_line import LogLine

FLASK_ENV = os.environ.get('FLASK_ENV', 'development')

app = Flask(__name__)

if FLASK_ENV == "production":    
    app.config.from_object(config.ProdConfig())
else: 
    app.config.from_object(config.DevConfig())

jwt = JWTManager(app)

api_log = ApiLog()

# initialize scheduler
sch = APScheduler()

# Jobs


@sch.task('interval', id='delete_revoked_tokens', hours=23, misfire_grace_time=900)
def job1():
    """Run scheduled job delete_revoked_tokens"""
    try:
        deleteRevokedTokens()
        print('Done!')
    except Exception as e:
        print(e)


@sch.task('interval', id='delete_archived_data_older_than_three_weeks', hours=24, misfire_grace_time=900)
def job2():
    """Run scheduled job delete_archived_data_older_than_three_weeks"""
    try:
        deleteUserDataOlderThanThreeWeeks()
        print('Done!')
    except Exception as e:
        print(e)


# if you don't wanna use a config, you can set options here:
#sch.api_enabled = app.config["SCHEDULER_API_ENABLED"]
sch.init_app(app)
sch.start()

app.register_blueprint(rest, url_prefix="/seta-ui/")
app.register_blueprint(base_routes, url_prefix="/seta-ui/")
app.register_blueprint(ecas, url_prefix="/seta-ui/")
app.register_blueprint(rsa, url_prefix="/seta-ui/")

if FLASK_ENV == "dev" or FLASK_ENV == "serve":
    cors = CORS(app, resources={r"/*": {"origins": "*"}})


class JSONEncoder(json.JSONEncoder):
    """extend json-encoder class"""

    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime.datetime):
            return str(o)
        return json.JSONEncoder.default(self, o)


app.json_encoder = JSONEncoder

app.cas_client = CASClient(
    version=3,
    service_url = app.config["FLASK_PATH"] +
    "/seta-ui/login",  # ?next=%2Fseta-ui%2Fseta
    # server_url='https://django-cas-ng-demo-server.herokuapp.com/cas/'
    server_url = app.config["AUTH_CAS_URL"],
)


# Callback function to check if a JWT exists
@jwt.token_in_blocklist_loader
def check_if_token_is_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    isRevoked = isTokenRevoked(jti)
    return isRevoked


@jwt.additional_claims_loader
def add_claims_to_access_token(identity):
    if session.get("username") != None:
        current_user = session["username"]
    else:
        current_user = get_jwt_identity()
    print(current_user)
    iat = time.time()
    additional_claims = {
        "user": getDbUser(current_user),
        "iat": iat,
        "iss": "SETA Flask server",
        "sub": current_user,
    }
    return additional_claims
