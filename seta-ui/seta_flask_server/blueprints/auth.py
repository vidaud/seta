from http import HTTPStatus
from injector import inject

from flask import current_app as app
from flask import (jsonify, redirect, make_response, session, Blueprint)

from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required
from flask_jwt_extended import set_access_cookies, unset_jwt_cookies
from flask_jwt_extended import get_jwt_identity, get_jwt

from flask_restx import Api, Resource, fields

from seta_flask_server.infrastructure.constants import ExternalProviderConstants
from seta_flask_server.infrastructure.helpers import set_token_info_cookies, unset_token_info_cookies
from seta_flask_server.infrastructure.auth_helpers import create_session_token

from seta_flask_server.repository.interfaces import ISessionsBroker

doc='/login/doc'
if app.config.get("DISABLE_SWAGGER_DOCUMENTATION"):
    doc = False

local_auth = Blueprint("auth", __name__)
local_auth_api = Api( local_auth,
               version="1.0",
               title="SeTA Authentication",
               doc=doc,
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
    "access_token_exp": fields.DateTime(description="Access token expiration date"),
    "refresh_token_exp": fields.DateTime(description="Refresh token expiration date"),
    "user_id": fields.String(description="Seta User Identifier"),
    "auth_provider": fields.String(description="Third-party authentication provider", enum=ExternalProviderConstants.List),
    "logout_url": fields.String(description="Logout url to be used by the web client")
})

@ns_auth.route("/logout/callback", methods=['GET'])
class SetaLogoutCallback(Resource):
    
    @inject
    def __init__(self, sessionsBroker: ISessionsBroker, api=None, *args, **kwargs):
        self.sessionsBroker = sessionsBroker
        super().__init__(api, *args, **kwargs)
    
    @ns_auth.doc(description="Thid-party provider callback for local logout",
            responses={int(HTTPStatus.FOUND): 'Redirect to home route'  })    
    def get(self):
        """ 
        Redirect from CAS logout request after CAS logout successfully.
        """
        
        session_id = session.get("session_id")
        if session_id:
            self.sessionsBroker.session_logout(session_id)
        
        session.clear()
        
        response = make_response(redirect(app.home_route))
        unset_jwt_cookies(response)
        unset_token_info_cookies(response=response)
        
        return response

@ns_auth.route("/logout", methods=["POST","GET"],
               doc={"description": "Local logout"})
@ns_auth.response(int(HTTPStatus.OK), 'Remove tokens from local domain cookies', status_model)
class SetaLogout(Resource):    
    
    @inject
    def __init__(self, sessionsBroker: ISessionsBroker, api=None, *args, **kwargs):
        self.sessionsBroker = sessionsBroker
        super().__init__(api, *args, **kwargs)
    
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
        
        session_id = session.get("session_id")
        
        if session_id:
            self.sessionsBroker.session_logout(session_id)
        
        session.clear()
        
        
        response = jsonify({"status": "success"})
        unset_jwt_cookies(response)
        unset_token_info_cookies(response=response)
        
        return response
    
@ns_auth.route("/refresh", methods=["POST","GET"],
               doc={"description": "Refresh access token"})
@ns_auth.response(int(HTTPStatus.OK), 'Set new access token in cookies', status_model)
class SetaRefresh(Resource):
    
    @inject
    def __init__(self, sessionsBroker: ISessionsBroker, api=None, *args, **kwargs):
        self.sessionsBroker = sessionsBroker
        super().__init__(api, *args, **kwargs)
    
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
        
        session_id = session.get("session_id")
        if session_id:
            st = create_session_token(session_id=session_id, token=access_token)
            self.sessionsBroker.session_add_token(st)

        response = jsonify({"status": "success"})
        set_access_cookies(response, access_token)        
        set_token_info_cookies(response=response, access_token_encoded=access_token)

        return response
