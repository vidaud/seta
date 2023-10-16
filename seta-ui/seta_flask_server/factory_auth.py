from flask import Flask, url_for
from werkzeug.middleware.proxy_fix import ProxyFix

#from cas import CASClient
from seta_flask_server.infrastructure.clients.cas_client import SetaCasClient
from seta_flask_server.infrastructure.extensions import (jwt, logs, github)

from seta_flask_server.infrastructure.helpers import MongodbJSONProvider
from seta_flask_server.infrastructure.constants import ExternalProviderConstants

from flask_injector import FlaskInjector
from seta_flask_server.dependency import MongoDbClientModule
from seta_flask_server.repository.interfaces import ISessionsBroker

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
      
    @jwt.additional_claims_loader   
    def add_claims_to_access_token(identity):        
        additional_claims = {
            "iss": "SETA Auth Server",
            "sub": identity["user_id"]
        }
        return additional_claims
    
    #Callback function to check if a JWT exists in the database block list
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
        jti = jwt_payload["jti"]
        
        sessionsBroker = app_injector.injector.get(ISessionsBroker)        
        return sessionsBroker.session_token_is_blocked(jti)
        
    app_injector = FlaskInjector(
        app=app,
        modules=[MongoDbClientModule()],
    )    
    
    return app
    
def register_blueprints(app: Flask):
    from seta_flask_server.blueprints.authorization.token_auth import token_auth
    from seta_flask_server.blueprints.authorization.token_info import token_info  

    from .blueprints.authentication.auth import local_auth
    from .blueprints.authentication.auth_ecas import auth_ecas    

    AUTHENTICATION_ROOT_V1="/authentication/v1"
    
    app.register_blueprint(token_info, url_prefix="/authorization/v1")

    app.register_blueprint(token_auth, url_prefix=AUTHENTICATION_ROOT_V1)    

    app.register_blueprint(local_auth, url_prefix=AUTHENTICATION_ROOT_V1)
    app.register_blueprint(auth_ecas, url_prefix=AUTHENTICATION_ROOT_V1)


    if any(provider.lower() == ExternalProviderConstants.GITHUB.lower() 
           for provider in app.config.get("SETA_IDENTITY_PROVIDERS", [])):
        from .blueprints.authentication.auth_github import auth_github
        app.register_blueprint(auth_github, url_prefix=AUTHENTICATION_ROOT_V1)
    
def register_extensions(app: Flask): 
    github.init_app(app)
    jwt.init_app(app)
    
    try:
        logs.init_app(app)
    except:
        app.logger.exception("logs config failed")

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
