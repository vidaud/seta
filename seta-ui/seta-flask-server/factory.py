import time
import logging
from datetime import datetime as dt

from flask import (Flask, request, session)
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix

from infrastructure.extensions import (scheduler, jwt, logs, github)

from blueprints.base_routes import base_routes
from blueprints.auth import auth, refresh_expiring_jwts
from blueprints.auth_ecas import auth_ecas
from blueprints.auth_github import auth_github
from blueprints.rest import rest
from blueprints.rsa import rsa
from blueprints.token_auth import token_auth
from blueprints.token_info import token_info

from infrastructure.helpers import JSONEncoder

from cas import CASClient

from flask_injector import FlaskInjector

from repository.interfaces import IUsersBroker
from dependency import MongoDbClientModule

def create_app(config_object):
    """Main app factory"""
    
    app = Flask(__name__)
    #Tell Flask it is Behind a Proxy
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_host=1)
    
    app.config.from_object(config_object)        
    app.json_encoder= JSONEncoder        
    app.home_route = "/seta-ui/#/home"   
    
    register_extensions(app)
    register_blueprints(app)
           
    request_endswith_ignore_list = ['.js', '.css', '.png', '.ico', '.svg', '.map', '.json', 'doc']
    request_starts_with_ignore_list = ['/authorization', '/authentication', '/login', '/logout', '/refresh']
    
    with app.app_context():                  
            
        @app.after_request
        def refresh_jwts(response):
            #app.logger.debug(request.path)
            
            if request.path.endswith(tuple(request_endswith_ignore_list)):
                return response
            
            if request.path.startswith(tuple(request_starts_with_ignore_list)):
                return response
            
            app.logger.debug("refresh_expiring_jwts")
            
            return refresh_expiring_jwts(response)
        
            
    @app.after_request
    def after_request(response):        
        
        """ Logging after every request. """
        if request.path.endswith(tuple(request_endswith_ignore_list)):
            return response
        
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
            logger_db.info("seta-ui request " + request.path, 
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
    
    @jwt.additional_claims_loader   
    def add_claims_to_access_token(identity):  
        usersBroker = app_injector.injector.get(IUsersBroker)
        user = usersBroker.get_user_by_username(identity)
        
        if user is None:
            #guest claims
            return {
                "user": {"username": identity},
                "iss": "SETA Flask server",
                "sub": identity,
                "role": "guest",
                "source_limit": 5
            }
        
        role = "user"
        if "role" in user:
            role = user["role"]
        # TODO update source and limit with mongodb fields
        source_limit = {"source": user["username"], "limit": 5}
        
        additional_claims = {
            "user": {"username": user["username"], "first_name": user["first_name"], "last_name": user["last_name"], "email": user["email"]},
            "iss": "SETA Flask server",
            "sub": identity,
            "role": role,
            "source_limit": source_limit
        }
        return additional_claims
        
    app_injector = FlaskInjector(
        app=app,
        modules=[MongoDbClientModule()],
    )
    
    if app.config['SCHEDULER_ENABLED']:            
        from infrastructure.scheduler import (tasks, events)            
        scheduler.start()
    
    return app
    
def register_blueprints(app):
    app.register_blueprint(rest, url_prefix="/rest/v1/")
    app.register_blueprint(base_routes, url_prefix="/seta-ui/")    
    app.register_blueprint(rsa, url_prefix="/rsa/v1/")
    
    app.register_blueprint(auth, url_prefix="/")
    app.register_blueprint(auth_ecas, url_prefix="/")
    app.register_blueprint(auth_github, url_prefix="/")
    
    app.register_blueprint(token_auth, url_prefix="/authentication/v1/")
    CORS(token_auth) #enable CORS on token_auth
    app.register_blueprint(token_info, url_prefix="/authorization/v1/")
    
def register_extensions(app):
    #the service_url will be changed before ECAS redirect with 'request.url'
    app.cas_client = CASClient(
        version=3,
        service_url = app.config["FLASK_PATH"] + "/login_callback_ecas",
        server_url = app.config["AUTH_CAS_URL"],
    )
    
    github.init_app(app)
    scheduler.init_app(app)
    jwt.init_app(app)
    logs.init_app(app)