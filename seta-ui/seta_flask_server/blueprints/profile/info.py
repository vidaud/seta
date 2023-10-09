from flask import current_app as app, jsonify, session
from flask_jwt_extended import jwt_required, get_jwt_identity, unset_jwt_cookies
from seta_flask_server.infrastructure.helpers import unset_token_info_cookies
from flask_restx import Namespace, Resource, abort

from http import HTTPStatus
from injector import inject

from seta_flask_server.infrastructure.constants import UserStatusConstants
from seta_flask_server.repository.interfaces import IUsersBroker, ISessionsBroker
from .models.info_dto import(user_info_model, account_model, provider_model)

account_info_ns = Namespace('Account Info', description='User Account')
account_info_ns.models[user_info_model.name] = user_info_model
account_info_ns.models[provider_model.name] = provider_model
account_info_ns.models[account_model.name] = account_model

@account_info_ns.route('/user-info', endpoint="me_user_info", methods=['GET'])
class UserInfo(Resource):
    @inject
    def __init__(self, usersBroker: IUsersBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
                
        super().__init__(api, *args, **kwargs)
     
    @account_info_ns.doc(description='Retrieve info for this user.',        
        responses={int(HTTPStatus.OK): "Retrieved info.",
                   int(HTTPStatus.NOT_FOUND): "User not found",},
        
        security='CSRF')
    @account_info_ns.marshal_with(user_info_model, mask="*")
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
    
    
   
@account_info_ns.route('/', endpoint="my_account", methods=['GET','DELETE'])        
class SetaAccount(Resource):
    @inject
    def __init__(self, usersBroker: IUsersBroker, sessionsBroker: ISessionsBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.sessionsBroker= sessionsBroker
        
        super().__init__(api, *args, **kwargs)
       
    @account_info_ns.doc(description='Retrieve account details.',        
        responses={int(HTTPStatus.OK): "'Retrieved account.",
                   int(HTTPStatus.NOT_FOUND): "User not found or disabled",},
        
        security='CSRF')
    @account_info_ns.marshal_with(account_model, mask="*") 
    @jwt_required()
    def get(self):
        """Retrieve account details"""

        identity = get_jwt_identity()        
        
        if "provider_uid" in identity:
            user = self.usersBroker.get_user_by_provider(provider_uid=identity["provider_uid"], 
                        provider=identity["provider"])
        else:
            user = self.usersBroker.get_user_by_id(user_id=identity["user_id"], load_scopes=False)
            user.authenticated_provider = user.external_providers[0]
        
        if user is None or user.is_not_active():
            app.logger.error(f"User {str(identity)} not found in the database!")
            abort(HTTPStatus.NOT_FOUND, "User not found in the database!")
            
        account_info = {
            "username": user.user_id,                  
            "email": user.email,                    
            "role": user.role,
            "external_providers": []
        }
        
        for provider in user.external_providers:
            ep = {
                "provider_uid": provider.provider_uid,
                "provider": provider.provider,
                "firstName": provider.first_name,
                "lastName": provider.last_name,
                "domain": provider.domain,
                "is_current_auth": provider.provider == user.authenticated_provider.provider
            }
            
            account_info["external_providers"].append(ep)
        
        return account_info
    
    @account_info_ns.doc(description='Set account as deleted for this user.',        
        responses={int(HTTPStatus.OK): "Account deleted.",
                   int(HTTPStatus.NOT_FOUND): "User not found",},
        
        security='CSRF')
    @jwt_required()   
    def delete(self):
        """ Mark user account as deleted """
        
        identity = get_jwt_identity()
        user_id=identity["user_id"]
        
        if not self.usersBroker.user_uid_exists(user_id):
            abort(HTTPStatus.NOT_FOUND, "User id not found")
            
        self.usersBroker.update_status(user_id=user_id, status=UserStatusConstants.Deleted)
        
        #destroy session token and cookies
        session_id = session.get("session_id")
        
        if session_id:
            self.sessionsBroker.session_logout(session_id)
        
        session.clear()        
        
        response = jsonify({"status": "success", "message": "Account deleted"})
        unset_jwt_cookies(response)
        unset_token_info_cookies(response=response)
        
        return response
