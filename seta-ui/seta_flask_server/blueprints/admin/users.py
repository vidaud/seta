from flask import current_app as app, jsonify, session
from flask_jwt_extended import jwt_required, get_jwt_identity
from seta_flask_server.infrastructure.constants import UserRoleConstants
from flask_restx import Namespace, Resource, abort

from http import HTTPStatus
from injector import inject

from seta_flask_server.repository.interfaces import IUsersBroker
from .models.users_dto import(user_info_model, account_model, provider_model, status_parser)

users_ns = Namespace('Seta Users', description='Seta User Accounts')
users_ns.models[user_info_model.name] = user_info_model
users_ns.models[provider_model.name] = provider_model
users_ns.models[account_model.name] = account_model

@users_ns.route('/infos', endpoint="admin_users", methods=['GET'])
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