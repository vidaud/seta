import logging

from flask import (Flask, request, session, url_for)
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_jwt_extended import get_jwt_identity

from .infrastructure.extensions import (scheduler, jwt, logs, github)
from .infrastructure.auth_helpers import refresh_expiring_jwts

from .infrastructure.helpers import MongodbJSONProvider
from seta_flask_server.repository.interfaces import ISessionsBroker
from seta_flask_server.infrastructure.auth_helpers import create_session_token

#from cas import CASClient
from seta_flask_server.infrastructure.clients.cas_client import SetaCasClient

from flask_injector import FlaskInjector
from .dependency import MongoDbClientModule

def create_app(config_object):
    """Main app factory"""
    
    app = Flask(__name__)
    #Tell Flask it is Behind a Proxy
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_host=1)
    
    app.config.from_object(config_object)    
    app.home_route = app.config.get("HOME_ROUTE")
        
    #use flask.json in all modules instead of python built-in json
    app.json_provider_class = MongodbJSONProvider
        
    register_extensions(app)   
    
    with app.app_context():
        register_blueprints(app)

    register_cas_client(app)
           
    request_endswith_ignore_list = ['.js', '.css', '.png', '.ico', '.svg', '.map', '.json', 'doc']
    request_starts_with_ignore_list = ['/authorization', '/authentication', '/seta-ui/api/v1/login', 
                                       '/seta-ui/api/v1/logout', '/seta-ui/api/v1/refresh', '/seta-ui/api/v1/me/user-info', '/seta-ui/api/v1/notifications']
    
    with app.app_context():
            
        @app.after_request
        def refresh_jwts(response):
            """Create a new access token if the current one is close to expiring date"""
            
            if app.testing:
                return response      
            
            if request.path.endswith(tuple(request_endswith_ignore_list)):
                return response
            
            if request.path.startswith(tuple(request_starts_with_ignore_list)):
                return response
                        
            response, new_access_token = refresh_expiring_jwts(app, response)
            
            if new_access_token:                
                session_id = session.get("session_id")
                
                if session_id:                    
                    st = create_session_token(session_id=session_id, token=new_access_token)
                    
                    sessionsBroker = app_injector.injector.get(ISessionsBroker)
                    sessionsBroker.session_add_token(st)
                    
            return response
        
            
    @app.after_request
    def after_request(response):        
        """ Logging after every request. """
        
        if request.path.endswith(tuple(request_endswith_ignore_list)):
            return response        
        
        if app.testing:
            app.logger.debug(request.path + ": " + str(response.status_code) + ", json: " + str(response.data))
            return response
                
        user_id = "unknown"                
        try:
            identity = get_jwt_identity()
            
            if identity:
                user_id = identity["user_id"]
        except:
            pass
            
        
        try:
          logger_db = logging.getLogger("mongo")
          if logger_db:              
            logger_db.info("seta-ui request " + request.path, 
                           extra={
                                "user_id": user_id,
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
        additional_claims = {
            "iss": "SETA API server",
            "sub": identity["user_id"]
        }
        return additional_claims
    
    # Callback function to check if a JWT exists in the database blocklist
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
        jti = jwt_payload["jti"]
        
        sessionsBroker = app_injector.injector.get(ISessionsBroker)        
        return sessionsBroker.session_token_is_blocked(jti)
     
    if app.config.get('SCHEDULER_ENABLED', False):            
        from seta_flask_server.infrastructure.scheduler import (tasks, events)            
        scheduler.start()   
        
    app_injector = FlaskInjector(
        app=app,
        modules=[MongoDbClientModule()],
    )    
    
    return app
    
def register_blueprints(app):
    
    from .blueprints.communities import communities_bp_v1
    from .blueprints.auth import local_auth
    from .blueprints.auth_ecas import auth_ecas
    from .blueprints.auth_github import auth_github
    from .blueprints.profile import profile_bp_v1
    from .blueprints.catalogue import catalogue_bp_v1
    from .blueprints.admin import admin_bp
    from .blueprints.notifications import notifications_bp_v1
    
    API_ROOT_V1="/seta-ui/api/v1"
                    
    app.register_blueprint(profile_bp_v1, url_prefix=API_ROOT_V1)   
    
    app.register_blueprint(local_auth, url_prefix=API_ROOT_V1)
    app.register_blueprint(auth_ecas, url_prefix=API_ROOT_V1)
    app.register_blueprint(auth_github, url_prefix=API_ROOT_V1)

    app.register_blueprint(communities_bp_v1, url_prefix=API_ROOT_V1)

    app.register_blueprint(catalogue_bp_v1, url_prefix=API_ROOT_V1)
    app.register_blueprint(notifications_bp_v1, url_prefix=API_ROOT_V1)

    app.register_blueprint(admin_bp, url_prefix=API_ROOT_V1)    
        
def register_extensions(app: Flask):    
    github.init_app(app)
    scheduler.init_app(app)
    jwt.init_app(app)
    
    try:
        logs.init_app(app)
    except:
        app.logger.error("logs config failed")
        
def register_cas_client(app: Flask):
    with app.app_context(), app.test_request_context():
        ecas_login_callback_url = url_for("auth_ecas.login_callback_ecas", _external=True)
        
    #app.logger.debug("Auth ECAS login callback: " + ecas_login_callback_url)
    
    #the service_url will be changed before ECAS redirect with 'request.url'
    app.cas_client = SetaCasClient(
        #version=3,
        service_url = ecas_login_callback_url,
        server_url = app.config.get("AUTH_CAS_URL"),
    )    
