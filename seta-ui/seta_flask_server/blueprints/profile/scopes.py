from flask_jwt_extended import get_jwt_identity, jwt_required

from flask_restx import Namespace, Resource, abort
from injector import inject
from http import HTTPStatus

from seta_flask_server.repository.interfaces import IUsersBroker
from .models.scopes_dto import (system_scope_model, community_scopes_model, resource_scopes_model, user_scopes_model)

from .logic.scopes_logic import build_user_scopes

scopes_ns = Namespace('Permissions', validate=True, description='SETA User Permissions')
scopes_ns.models[system_scope_model.name] = system_scope_model
scopes_ns.models[community_scopes_model.name] = community_scopes_model
scopes_ns.models[resource_scopes_model.name] = resource_scopes_model
scopes_ns.models[user_scopes_model.name] = user_scopes_model

@scopes_ns.route('/permissions', endpoint="user_permission_list", methods=['GET'])
class UserPermissionList(Resource):
    '''Get a list of all user scopes'''
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker        
        
        super().__init__(api, *args, **kwargs)

    @scopes_ns.doc(description='Retrieve all scopes list for the authenticated user.',
        responses={int(HTTPStatus.OK): "'Retrieved permissions list."},
        security='CSRF')
    @scopes_ns.marshal_with(user_scopes_model, mask="*", skip_none=True)
    @jwt_required()    
    def get(self):
        '''Retrieve all scopes list for the authenticated user'''

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        return build_user_scopes(user)