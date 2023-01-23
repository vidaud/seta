import logging

from flask import (Flask, request, session, url_for)
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

from blueprints.communities import communities_bp_v1

from infrastructure.helpers import JSONEncoder

#from cas import CASClient
from infrastructure.cas_client import SetaCasClient

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
    app.home_route = '/seta-ui/'
    
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
        # TODO update source and limit with mongodb fields
        #usersBroker = app_injector.injector.get(IUsersBroker)            
        
        source_limit = {"source": identity["user_id"], "limit": 5}
        
        additional_claims = {
            "iss": "SETA Flask server",
            "sub": identity["user_id"],
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
    app.register_blueprint(token_info, url_prefix="/authorization/v1/")

    app.register_blueprint(communities_bp_v1, url_prefix="/communities/v1/")
    
def register_extensions(app):
    #the service_url will be changed before ECAS redirect with 'request.url'
    app.cas_client = SetaCasClient(
        #version=3,
        service_url = app.config["FLASK_PATH"] + "/login/callback/ecas",
        server_url = app.config["AUTH_CAS_URL"],
    )
    
    github.init_app(app)
    scheduler.init_app(app)
    jwt.init_app(app)
    logs.init_app(app)
