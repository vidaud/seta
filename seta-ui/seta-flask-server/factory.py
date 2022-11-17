import time
import logging
from datetime import datetime as dt

from flask import (Flask, request, session)
#from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix

from infrastructure.extensions import (scheduler, jwt, logs)
from db.db_users_broker import (getDbUser)

from blueprints.base_routes import base_routes
from blueprints.ecas import ecas
from blueprints.rest import rest
from blueprints.rsa import rsa

from blueprints.login import login_bp, refresh_expiring_jwts

from infrastructure.helpers import JSONEncoder

from cas import CASClient

def create_app(config_object):
    """Main app factory"""
    
    app = Flask(__name__)
    #Tell Flask it is Behind a Proxy
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_host=1)
    
    app.config.from_object(config_object)        
    app.json_encoder= JSONEncoder
      
     #the service_url will be changed before ECAS redirect with 'request.url'
    app.cas_client = CASClient(
        version=3,
        service_url = app.config["FLASK_PATH"] + "/seta-ui/v2/login",
        #service_url = "",
        server_url = app.config["AUTH_CAS_URL"],
    )
    app.home_route = "/seta-ui/#/home"   
    
    register_extensions(app)
    register_blueprints(app)
    
    app.logger.debug(app.url_map)
      
    '''
    def is_debug_mode():
        """Get app debug status."""
        if not app.config['DEBUG']:
            return app.config['FLASK_ENV'] == "development"
        return app.config['DEBUG']
    '''      
    request_ignore_list = ['.js', '.css', '.png', '.ico', '.svg', '.map']
    with app.app_context():
        #if is_debug_mode():
        #    CORS(app, resources={r"/*": {"origins": "*"}})
        #else
            #CORS(app, origins=[app.config["FLASK_PATH"]])
        
        if app.config['SCHEDULER_ENABLED']:
            from infrastructure.scheduler import (tasks, events)            
            scheduler.start()
            
        @app.after_request
        def refresh_jwts(response):
            if request.path.endswith(tuple(request_ignore_list)):
                return response
            
            return refresh_expiring_jwts(response)
        
            
    @app.after_request
    def after_request(response):
        """ Logging after every request. """
        if request.path.endswith(tuple(request_ignore_list)):
            return response
        
#        user = session["username"]
        user = session.get("username")
        if not user:
            user="None"
        
        '''
        #seta-nginx is logging the access
        
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
        '''
        try:
          logger_db = logging.getLogger("mongo")
          if logger_db:
            logger_db.info("seta-ui request", 
                           extra={
                               "username": user,
                               "address": request.remote_addr, 
                                "method": request.method,
                                "path": request.full_path,
                                "status": response.status,
                                "content_length": response.content_length,
                                "referrer": request.referrer,
                                "user_agent": repr(request.user_agent),
                                })
        except:
               app.logger.exception("seta-api logger db exception")        
        return response       
        
    return app
    
def register_blueprints(app):
    app.register_blueprint(rest, url_prefix="/seta-ui/")
    app.register_blueprint(base_routes, url_prefix="/seta-ui/")
    app.register_blueprint(ecas, url_prefix="/seta-ui/")
    app.register_blueprint(rsa, url_prefix="/seta-ui/")
    
    app.register_blueprint(login_bp, url_prefix="/seta-ui/v2/")   
    
def register_extensions(app):
    scheduler.init_app(app)
    jwt.init_app(app)
    logs.init_app(app)

@jwt.additional_claims_loader
def add_claims_to_access_token(identity):
    '''
    if session.get("username") != None:
        current_user = session["username"]
    else:
        current_user = get_jwt_identity()
    '''
    
    iat = time.time()
    user = getDbUser(identity)
    
    role = "user"
    if "role" in user:
        role = user["role"]
    # TODO update source and limit with mongodb fields
    source_limit = {"source": user["username"], "limit": 5}
    
    additional_claims = {
        "user": {"username": user["username"], "first_name": user["first_name"], "last_name": user["last_name"], "email": user["email"]},
        "iat": iat,
        "iss": "SETA Flask server",
        "sub": identity,
        "role": role,
        "source_limit": source_limit
    }
    return additional_claims   
