from flask import (Flask, request)
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_jwt_extended import get_jwt_identity

from .infrastructure.extensions import (jwt, logs)

from .infrastructure.helpers import MongodbJSONProvider

from flask_injector import FlaskInjector
from .infrastructure.mongo_dependency import MongoDbClientModule
from seta_auth.repository.interfaces import ISessionsBroker

def create_app(config_object):
    """Main app factory"""
    
    app = Flask(__name__)
    #Tell Flask it is Behind a Proxy
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_host=1)
    
    app.config.from_object(config_object)
        
    #use flask.json in all modules instead of python built-in json
    app.json_provider_class = MongodbJSONProvider
        
    
    register_extensions(app)
    register_blueprints(app)
      
    @jwt.additional_claims_loader   
    def add_claims_to_access_token(identity):        
        additional_claims = {
            "iss": "SETA Auth Server",
            "sub": identity["user_id"]
        }
        return additional_claims
    
     # Callback function to check if a JWT exists in the database blocklist
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
        jti = jwt_payload["jti"]
        
        sessionsBroker = app_injector.injector.get(ISessionsBroker)        
        return sessionsBroker.session_token_is_blocked(jti)
    
    @app.after_request
    def after_request(response):        
        """ Logging after every request. """       
        
        if app.testing:
            app.logger.debug(request.path + ": " + str(response.status_code) + ", json: " + str(response.data))
            return response
        
    app_injector = FlaskInjector(
        app=app,
        modules=[MongoDbClientModule()],
    )    
    
    return app
    
def register_blueprints(app):
    from .blueprints.token_auth import token_auth
    from .blueprints.token_info import token_info  
    
    app.register_blueprint(token_auth, url_prefix="/authentication/v1")
    app.register_blueprint(token_info, url_prefix="/authorization/v1")
    
def register_extensions(app): 
    jwt.init_app(app)
    
    try:
        logs.init_app(app)
    except:
        app.logger.exception("logs config failed")
