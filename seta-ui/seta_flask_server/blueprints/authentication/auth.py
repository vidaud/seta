from http import HTTPStatus
from injector import inject

from flask import abort, current_app as app, url_for
from flask import (jsonify, redirect, make_response, session, Blueprint)

from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required
from flask_jwt_extended import set_access_cookies, unset_jwt_cookies
from flask_jwt_extended import get_jwt_identity, get_jwt

from flask_restx import Api, Resource, fields

from seta_flask_server.infrastructure.constants import ExternalProviderConstants, UserRoleConstants
from seta_flask_server.infrastructure.helpers import set_token_info_cookies, unset_token_info_cookies
from seta_flask_server.infrastructure.auth_helpers import create_session_token

from seta_flask_server.repository.interfaces import ISessionsBroker, IUsersBroker

from .models.auth_dto import (status_model, user_info_model, authenticators_model, auth_models)

doc='/web/doc'
if app.config.get("DISABLE_SWAGGER_DOCUMENTATION"):
    doc = False

local_auth = Blueprint("auth", __name__)
local_auth_api = Api(local_auth,
               version="1.0",
               title="SeTA Authentication",
               doc=doc,
               description="Authentication methods for the web application",
               default_swagger_filename="swagger_auth.json")

local_auth_api.models.update(auth_models)

ns_auth = local_auth_api.namespace("", "SETA Authentication Endpoints")

@ns_auth.route("/logout/callback", methods=['GET'])
class SetaLogoutCallback(Resource):
    
    @inject
    def __init__(self, sessionsBroker: ISessionsBroker, api=None, *args, **kwargs):
        self.sessionsBroker = sessionsBroker
        super().__init__(api, *args, **kwargs)
    
    @ns_auth.doc(description="Third-party provider callback for local logout",
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

@ns_auth.route("/logout", methods=["POST"],
               doc={"description": "Local logout"})
@ns_auth.response(int(HTTPStatus.OK), 'Remove tokens from local domain cookies', status_model)
class SetaLogout(Resource):    
    
    @inject
    def __init__(self, sessionsBroker: ISessionsBroker, api=None, *args, **kwargs):
        self.sessionsBroker = sessionsBroker
        super().__init__(api, *args, **kwargs)
    
    @ns_auth.marshal_with(status_model)
    def post(self):
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
        return self._refresh()
    
    @jwt_required(refresh=True)
    def post(self):
        return self._refresh()

    def _refresh(self):
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


@ns_auth.route('/user-info', endpoint="me_user_info", methods=['GET'])
class UserInfo(Resource):
    @inject
    def __init__(self, usersBroker: IUsersBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
                
        super().__init__(api, *args, **kwargs)
     
    @ns_auth.doc(description='Retrieve info for this user.',        
        responses={int(HTTPStatus.OK): "Retrieved info.",
                   int(HTTPStatus.NOT_FOUND): "User not found",},
        
        security='CSRF')
    @ns_auth.marshal_with(user_info_model, mask="*")
    @jwt_required()   
    def get(self):
        """ Returns user details"""
        
        identity = get_jwt_identity()        
        
        if "provider_uid" in identity:
            user = self.usersBroker.get_user_by_provider(provider_uid=identity["provider_uid"], 
                        provider=identity["provider"])
        else:
            user = self.usersBroker.get_user_by_id(user_id=identity["user_id"], load_scopes=False)
            user.authenticated_provider = user.external_providers[0]
        
        if user is None or user.is_not_active():            
            abort(HTTPStatus.NOT_FOUND, "User not found in the database!")

        return {
                "username": user.user_id, 
                "firstName": user.authenticated_provider.first_name, 
                "lastName": user.authenticated_provider.last_name,
                "email": user.email,
                "role": user.role,
                "domain": user.authenticated_provider.domain
                }

@ns_auth.route("/authenticators", methods=["GET"], endpoint="authenticators")   
class SetaIdentityProviders(Resource):

    @ns_auth.doc(description='Retrieve authenticators for SeTA web application.',        
        responses={int(HTTPStatus.OK): "Retrieved list."})
    @ns_auth.marshal_list_with(authenticators_model, mask="*")
    def get(self):
        
        identity_providers = list(app.config.get("SETA_IDENTITY_PROVIDERS", []))

        result = []

        if any(p.lower() == ExternalProviderConstants.ECAS.lower() for p in identity_providers):
            result.append({
                "name": ExternalProviderConstants.ECAS,
                "login_url": url_for("auth_ecas.login"),
                "logout_url": url_for("auth_ecas.logout_ecas")
            })

        if any(p.lower() == ExternalProviderConstants.GITHUB.lower() for p in identity_providers):
            result.append({
                "name": ExternalProviderConstants.GITHUB,
                "login_url": url_for("auth_github.login"),
                "logout_url": url_for("auth._seta_logout")
            })

        return result

    
