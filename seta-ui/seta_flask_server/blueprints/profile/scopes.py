from flask_jwt_extended import get_jwt_identity, jwt_required
from flask import current_app

from flask_restx import Namespace, Resource, abort
from injector import inject
from http import HTTPStatus

from seta_flask_server.repository.models import EntityScope
from seta_flask_server.repository.interfaces import IUsersBroker, IUserPermissionsBroker
from .models.scopes_dto import (system_scope_model, community_scopes_model, resource_scopes_model, user_scopes_model)

scopes_ns = Namespace('Permissions', validate=True, description='SETA User Permissions')
scopes_ns.models[system_scope_model.name] = system_scope_model
scopes_ns.models[community_scopes_model.name] = community_scopes_model
scopes_ns.models[resource_scopes_model.name] = resource_scopes_model
scopes_ns.models[user_scopes_model.name] = user_scopes_model

@scopes_ns.route('/permissions', endpoint="user_permission_list", methods=['GET'])
class UserPermissionList(Resource):
    '''Get a list of all user scopes'''
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, permissionsBroker: IUserPermissionsBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.permissionsBroker = permissionsBroker
        
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

        community_scopes = self.permissionsBroker.get_all_user_community_scopes(auth_id)
        resource_scopes = self.permissionsBroker.get_all_user_resource_scopes(auth_id)
        system_scopes = self.permissionsBroker.get_all_user_system_scopes(auth_id)

        user_scopes = {
            "system_scopes": [],
            "community_scopes": [],
            "resource_scopes": []
        }

        for scope in system_scopes:
            user_scopes["system_scopes"].append({"area": scope.area, "scope": scope.system_scope})

        if community_scopes and len(community_scopes) > 0:
            user_scopes["community_scopes"] = _group_entity_scopes(scopes=community_scopes, id_field="community_id")

        if resource_scopes and len(resource_scopes) > 0:
            user_scopes["resource_scopes"] = _group_entity_scopes(scopes=resource_scopes, id_field="resource_id")
        
        return user_scopes

def _group_entity_scopes(scopes: list[EntityScope], id_field: str) -> list[dict]:
    scope_list = []
    for scope in scopes:
        entry = next((us for us in scope_list if us[id_field] == scope.id), None)

        if entry:
            entry["scopes"].append(scope.scope)
        else:           
            scope_list.append({id_field: scope.id, "scopes": [scope.scope]})

    return scope_list