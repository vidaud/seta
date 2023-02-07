from flask_restx import Api, Resource, fields
from http import HTTPStatus

from datetime import datetime
from datetime import timedelta
from datetime import timezone

from flask import Blueprint
from flask import current_app as app
from flask import (jsonify, redirect, make_response, url_for)

from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, verify_jwt_in_request
from flask_jwt_extended import set_access_cookies, unset_jwt_cookies
from flask_jwt_extended import get_jwt_identity, get_jwt

from infrastructure.constants import ExternalProviderConstants

auth = Blueprint("auth", __name__)

local_auth_api = Api(auth, 
               version="1.0",
               title="SeTA Authentication",
               doc="/login/doc",
               description="Local authentication methods",
               default_swagger_filename="login/swagger_auth.json",
               )
ns_auth = local_auth_api.namespace("", "SETA Authentication Endpoints")

status_model = ns_auth.model(
    "Status",
    {
        'status': fields.String(required=True, description="Returned status for the requested operation", enum=["success", "fail"])
     }
)


login_info_model = ns_auth.model("LoginInfo", {
    "token_exp": fields.DateTime(description="Token expiration date"),
    "user_id": fields.String(description="Seta User Identifier"),
    "auth_provider": fields.String(description="Third-party authentication provider", enum=ExternalProviderConstants.List),
    "logout_url": fields.String(description="Logout url to be used by the web client")
})

@ns_auth.route("/logout/callback", methods=['GET'])
class SetaLogoutCallback(Resource):
    
    @ns_auth.doc(description="Thid-party provider callback for local logout",
            responses={int(HTTPStatus.FOUND): 'Redirect to home route'  })    
    def get(self):
        """ 
        Redirect from CAS logout request after CAS logout successfully.
        """
        
        response = make_response(redirect(app.home_route))
        unset_jwt_cookies(response)
        return response

@ns_auth.route("/logout", methods=["POST","GET"],
               doc={"description": "Local logout"})
@ns_auth.response(int(HTTPStatus.OK), 'Remove tokens from local domain cookies', status_model)
class SetaLogout(Resource):    
    
    #@ns_auth.marshal_with(status_model)
    def get(self):
        app.logger.debug("Local logout")
        return self.logout_local()
    
    #@ns_auth.marshal_with(status_model)
    def post(self):
        return self.logout_local()

    def logout_local(self):
        """
        Remove tokens from cookies, but third-party cookies will remain
        """
        #session.pop("username", None)
        response = jsonify({"status": "success"})
        unset_jwt_cookies(response)
        return response
    
@ns_auth.route("/refresh", methods=["POST","GET"],
               doc={"description": "Refresh access token"})
@ns_auth.response(int(HTTPStatus.OK), 'Set new access token in cookies', status_model)
class SetaRefresh(Resource):
    
    @jwt_required(refresh=True)
    def get(self):
        return self.refresh()
    
    @jwt_required(refresh=True)
    def get(self):
        return self.refresh()


    def refresh(self):
        identity = get_jwt_identity()
            
        additional_claims = None
        
        jwt = get_jwt()
        role = jwt.get("role", None)
        if role is not None:
            additional_claims = {"role": role}

        access_token = create_access_token(identity = identity, fresh=False, additional_claims=additional_claims)

        response = jsonify({"status": "success"})
        set_access_cookies(response, access_token)

        return response
    
@ns_auth.route("/login/info", methods=['GET'])
class SetaLoginInfo(Resource):
    
    @ns_auth.doc(description="Token information",
            responses={int(HTTPStatus.OK): 'Token information',
                       int(HTTPStatus.UNAUTHORIZED): 'Unauthorized JWT',
                       int(HTTPStatus.UNPROCESSABLE_ENTITY): 'Invalid token'})
    @ns_auth.marshal_with(login_info_model)
    @jwt_required()
    def get(self):
        """ 
        Get token information.
        """
        
        jwt = get_jwt()
        identity = get_jwt_identity()
        
        exp_timestamp = jwt["exp"]
        
        expire_date = datetime.fromtimestamp(exp_timestamp)
        provider = str(identity["provider"])
        
        logout_url = url_for('auth._seta_logout')
        
        if provider.lower() == ExternalProviderConstants.ECAS.lower():
            logout_url = url_for('auth_ecas.logout_ecas')
        
        return {"token_exp": expire_date, "user_id": identity["user_id"], "auth_provider": provider, "logout_url": logout_url}    

def refresh_expiring_jwts(response):
    try:
        token_expires = app.config['JWT_ACCESS_TOKEN_EXPIRES']
                
        if token_expires is None:
            app.logger.debug("set token_expires to 15 min")
            token_expires = timedelta(minutes=1)

        print("token_expires:" + str(token_expires))
                
        jwt = get_jwt()      
        exp_timestamp = jwt["exp"]
        now = datetime.now(timezone.utc)        
                
        expire_minutes = (token_expires.total_seconds() / 60) // 2
        delta = timedelta(minutes=expire_minutes)
        
        target_timestamp = datetime.timestamp(now + delta)

        app.logger.debug("Refresh token only if " + str(target_timestamp) + " > " + str(exp_timestamp))

        if target_timestamp > exp_timestamp:
                        
            identity = get_jwt_identity()
            additional_claims = None
            role = jwt.get("role", None)
            if role is not None:
                additional_claims = {"role": role}
            
            access_token = create_access_token(identity=identity, fresh=False, additional_claims=additional_claims)
            set_access_cookies(response, access_token)
            
            
            app.logger.debug("target_timestamp: " 
                        + str(datetime.fromtimestamp(target_timestamp)) 
                        + ", exp_timestamp: " 
                        + str(datetime.fromtimestamp(exp_timestamp)))
            app.logger.debug("Expiring access token was refreshed.")            
    except Exception as e:
        # Case where there is not a valid JWT. Just return the original response
        print(e)
        app.logger.exception("Could not refresh the expiring token.")        
        return response
    finally:
        return response
