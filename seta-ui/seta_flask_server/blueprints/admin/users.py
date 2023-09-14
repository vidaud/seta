from flask import current_app as app, jsonify, session
from flask_jwt_extended import jwt_required, get_jwt_identity
from seta_flask_server.infrastructure.constants import UserRoleConstants
from flask_restx import Namespace, Resource, abort

from http import HTTPStatus
from injector import inject

from seta_flask_server.repository.interfaces import IUsersBroker, ISessionsBroker
from .models.users_dto import(user_info_model, account_model, provider_model, account_details_model, status_parser)

users_ns = Namespace('Seta Users', description='Seta User Accounts')
users_ns.models[user_info_model.name] = user_info_model
users_ns.models[provider_model.name] = provider_model
users_ns.models[account_details_model.name] = account_details_model
users_ns.models[account_model.name] = account_model

@users_ns.route('/infos', endpoint="admin_user_infos", methods=['GET'])
class UserInfos(Resource):
    @inject
    def __init__(self, usersBroker: IUsersBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
                
        super().__init__(api, *args, **kwargs)
     
    @users_ns.doc(description='Retrieve users info.',        
        responses={int(HTTPStatus.OK): "Retrieved users."},        
        security='CSRF')
    @users_ns.expect(status_parser)
    @users_ns.marshal_list_with(user_info_model, mask="*")    
    @jwt_required()   
    def get(self):
        """ Returns users details"""
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]        
        
        user = self.usersBroker.get_user_by_id(auth_id)        
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        if user.role.lower() != UserRoleConstants.Admin.lower():        
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        request_dict = status_parser.parse_args()
        status = request_dict.get("status", None)
        
        seta_users = self.usersBroker.get_all() if status is None else self.usersBroker.get_all_by_status(status)

        return [{
                "username": user.user_id, 
                "fullName": user.full_name,
                "email": user.email,
                "role": user.role,
                "status": user.status
                } for user in seta_users]
    
    @users_ns.route('/', endpoint="admin_users", methods=['GET'])        
    class SetaAccounts(Resource):
        @inject
        def __init__(self, usersBroker: IUsersBroker, sessionsBroker: ISessionsBroker, api=None, *args, **kwargs):
            self.usersBroker = usersBroker
            self.sessionsBroker= sessionsBroker
            
            super().__init__(api, *args, **kwargs)
        
        @users_ns.doc(description='Retrieve user accounts.',        
            responses={int(HTTPStatus.OK): "'Retrieved accounts."},
            
            security='CSRF')
        @users_ns.marshal_list_with(account_model, mask="*") 
        @jwt_required()
        def get(self):
            """Retrive user accounts"""

            identity = get_jwt_identity()
            auth_id = identity["user_id"]        
            
            user = self.usersBroker.get_user_by_id(auth_id)        
            if user is None or user.is_not_active():
                abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
            
            if user.role.lower() != UserRoleConstants.Admin.lower():        
                abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

            seta_users = self.usersBroker.get_all()  
            account_details = self.usersBroker.get_account_details()

            accounts = []

            for user in seta_users: 
                
                account_info = {
                    "username": user.user_id,
                    "email": user.email,
                    "role": user.role,
                    "status": user.status,
                    "createdAt": user.created_at,
                    "externalProviders": []                    
                }
                
                for provider in user.external_providers:
                    ep = {
                        "providerUid": provider.provider_uid,
                        "provider": provider.provider,
                        "firstName": provider.first_name,
                        "lastName": provider.last_name
                    }
                    
                    account_info["externalProviders"].append(ep)

                details = next((ad for ad in account_details if ad.user_id == user.user_id), None)
                if details is not None:
                    account_info["details"] = {
                        "hasRsaKey": details.has_rsa_key,
                        "appsCount": details.applications_count,
                        "lastActive": details.last_active
                    }

                accounts.append(account_info)
            
            return accounts