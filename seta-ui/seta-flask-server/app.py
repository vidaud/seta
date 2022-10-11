import os
import time
from xml.etree.ElementInclude import include

from bson import ObjectId, datetime
from flask import (Flask, session)

from flask_cors import CORS
from flask_jwt_extended import JWTManager, get_jwt_identity

import config

from infrastructure.extensions import (scheduler)
from db.db_revoked_tokens_broker import (isTokenRevoked)
from db.db_users_broker import (getDbUser)

from blueprints.base_routes import base_routes
from blueprints.ecas import ecas
from blueprints.rest import rest
from blueprints.rsa import rsa

#from log_utils.api_log import ApiLog
from infrastructure.helpers import JSONEncoder
import logging

FLASK_ENV = os.environ.get('FLASK_ENV', 'development')
FLASK_DEBUG = os.environ.get('FLASK_DEBUG', False)

def is_debug_mode():
    """Get app debug status."""
    if not FLASK_DEBUG:
        return FLASK_ENV == "development"
    return FLASK_DEBUG.lower() not in ("0", "false", "no")

app = Flask(__name__)

if FLASK_ENV == "production":    
    app.config.from_object(config.ProdConfig())
else: 
    app.config.from_object(config.DevConfig())

jwt = JWTManager(app)

# if you don't wanna use a config, you can set options here:
#scheduler.api_enabled = app.config["SCHEDULER_API_ENABLED"]
scheduler.init_app(app)

app.register_blueprint(rest, url_prefix="/seta-ui/")
app.register_blueprint(base_routes, url_prefix="/seta-ui/")
app.register_blueprint(ecas, url_prefix="/seta-ui/")
app.register_blueprint(rsa, url_prefix="/seta-ui/")

with app.app_context():
    if is_debug_mode():
        cors = CORS(app, resources={r"/*": {"origins": "*"}})        
    else:
        from infrastructure.scheduler import (tasks, events)        
        
        scheduler.start()        
        
    from infrastructure.cas_client import cas_client
    app.cas_client = cas_client    
    #api_log = ApiLog()

app.json_encoder= JSONEncoder


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
    
    iat = time.time()
    additional_claims = {
        "user": getDbUser(current_user),
        "iat": iat,
        "iss": "SETA Flask server",
        "sub": current_user,
    }
    return additional_claims
