from flask import (Flask, url_for)
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
        # TODO update source and limit with mongodb fields
        #usersBroker = app_injector.injector.get(IUsersBroker)            
        
        source_limit = {"source": identity["user_id"], "limit": 5}
        
        additional_claims = {
            "iss": "SETA Flask server",
            "sub": identity["user_id"],
            "source_limit": source_limit
        }
        return additional_claims
    
     # Callback function to check if a JWT exists in the database blocklist
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
        app.logger.error("logs config failed")
