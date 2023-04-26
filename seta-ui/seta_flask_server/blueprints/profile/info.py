from flask import current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restx import Namespace, Resource, abort

from http import HTTPStatus
from injector import inject

from seta_flask_server.repository.interfaces import IUsersBroker
from .models.info_dto import(user_info_model, account_model, application_model, provider_model)

account_info_ns = Namespace('Account Info', description='User Account')
account_info_ns.models[user_info_model.name] = user_info_model
account_info_ns.models[provider_model.name] = provider_model
account_info_ns.models[application_model.name] = application_model
account_info_ns.models[account_model.name] = account_model

@account_info_ns.route('/user-info', endpoint="me_user_info", methods=['GET'])
class UserInfo(Resource):
    @inject
    def __init__(self, usersBroker: IUsersBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        
        super().__init__(api, *args, **kwargs)
     
    @account_info_ns.doc(description='Retrieve info for this user.',        
        responses={int(HTTPStatus.OK): "'Retrieved info.",
                   int(HTTPStatus.NOT_FOUND): "User not found",},
        
        security='CSRF')
    @account_info_ns.marshal_list_with(user_info_model, mask="*")
    @jwt_required()   
    def get(self):
        """ Returns user details"""
        
        identity = get_jwt_identity()        
        
        user = self.usersBroker.get_user_by_id_and_provider(user_id=identity["user_id"], 
                    provider_uid=identity["provider_uid"], 
                    provider=identity["provider"])
        
        if user is None:
            app.logger.error(f"User {str(identity)} not found in the database!")
            abort(HTTPStatus.NOT_FOUND, "User not found in the database!")

        return {
                "username": user.user_id, 
                "firstName": user.authenticated_provider.first_name, 
                "lastName": user.authenticated_provider.last_name,
                "email": user.email,
                "role": user.role
                }
   
@account_info_ns.route('/', endpoint="my_account", methods=['GET'])        
class SetaAccount(Resource):
    @inject
    def __init__(self, usersBroker: IUsersBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        
        super().__init__(api, *args, **kwargs)
       
    @account_info_ns.doc(description='Retrieve account details.',        
        responses={int(HTTPStatus.OK): "'Retrieved account.",
                   int(HTTPStatus.NOT_FOUND): "User not found or disabled",},
        
        security='CSRF')
    @account_info_ns.marshal_list_with(account_model, mask="*") 
    @jwt_required()
    def get(self):
        """Retrive account details"""

        identity = get_jwt_identity()        
        
        user = self.usersBroker.get_user_by_id_and_provider(user_id=identity["user_id"], 
                    provider_uid=identity["provider_uid"], 
                    provider=identity["provider"])
        
        if user is None:
            app.logger.error(f"User {str(identity)} not found in the database!")
            abort(HTTPStatus.NOT_FOUND, "User not found in the database!")
            
        account_info = {
            "username": user.user_id,                  
            "email": user.email,                    
            "role": user.role,
            "external_providers": [],
            "applications": []
        }
        
        for provider in user.external_providers:
            ep = {
                "provider_uid": provider.provider_uid,
                "provider": provider.provider,
                "firstName": provider.first_name,
                "lastName": provider.last_name,
                "is_current_auth": provider.provider == user.authenticated_provider.provider
            }
            
            account_info["external_providers"].append(ep)
        
        return account_info
