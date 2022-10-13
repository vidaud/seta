import time
from datetime import datetime as dt
import logging

from flask import (Flask, session, request)
from flask_jwt_extended import get_jwt_identity
from flask_cors import CORS

from infrastructure.extensions import (scheduler, jwt, logs)
from db.db_revoked_tokens_broker import (isTokenRevoked)
from db.db_users_broker import (getDbUser)

from blueprints.base_routes import base_routes
from blueprints.ecas import ecas
from blueprints.rest import rest
from blueprints.rsa import rsa

from infrastructure.helpers import JSONEncoder

from cas import CASClient

def create_app(config_object):
    """Main app factory"""
    
    app = Flask(__name__)
    app.config.from_object(config_object)
    
    app.json_encoder= JSONEncoder
    
    app.cas_client = CASClient(
        version=3,
        service_url = app.config["FLASK_PATH"] +
        "/seta-ui/login",  # ?next=%2Fseta-ui%2Fseta
        server_url = app.config["AUTH_CAS_URL"],
    )    
    
    register_extensions(app)
    register_blueprints(app)
    
    def is_debug_mode():
        """Get app debug status."""
        if not app.config['DEBUG']:
            return app.config['FLASK_ENV'] == "development"
        return app.config['DEBUG'].lower() not in ("0", "false", "no")
    
    with app.app_context():
        if is_debug_mode():
            CORS(app, resources={r"/*": {"origins": "*"}})        
        
        if app.config['SCHEDULER_ENABLED']:
            from infrastructure.scheduler import (tasks, events)            
            scheduler.start()
                
    @app.after_request
    def after_request(response):
        """ Logging after every request. """
        logger = logging.getLogger("app.access")
        logger.info(
            "%s [%s] %s %s %s %s %s %s %s",
            request.remote_addr,
            dt.utcnow().strftime("%d/%b/%Y:%H:%M:%S.%f")[:-3],
            request.method,
            request.path,
            request.scheme,
            response.status,
            response.content_length,
            request.referrer,
            request.user_agent,
        )
        return response
        
    return app
    
def register_blueprints(app):
    app.register_blueprint(rest, url_prefix="/seta-ui/")
    app.register_blueprint(base_routes, url_prefix="/seta-ui/")
    app.register_blueprint(ecas, url_prefix="/seta-ui/")
    app.register_blueprint(rsa, url_prefix="/seta-ui/")
    
def register_extensions(app):
    scheduler.init_app(app)
    jwt.init_app(app)
    logs.init_app(app)
    
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