from flask import jsonify
from flask_jwt_extended import get_jwt_identity

from flask_restx import Namespace, Resource, abort
from http import HTTPStatus
from injector import inject

from seta_flask_server.infrastructure.decorators import auth_validator
from seta_flask_server.repository.interfaces import IUsersBroker, IUserPermissionsBroker, IResourcesBroker
from seta_flask_server.infrastructure.scope_constants import CommunityScopeConstants

from seta_flask_server.blueprints.communities.models.permissions_dto import user_scope_model, resource_scopes_parser

permissions_ns = Namespace('Resource User Permissions', validate=True, description='SETA Resource User Permissions')
permissions_ns.models[user_scope_model.name] = user_scope_model

@permissions_ns.route('/resource/<string:resource_id>', endpoint="resource_permission_list", methods=['GET'])
@permissions_ns.param("resource_id", "Resource id")
class ResourcePermissionList(Resource):
    '''Get a list of all resource permissions'''
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, permissionsBroker: IUserPermissionsBroker, resourcesBroker: IResourcesBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.permissionsBroker = permissionsBroker
        self.resourcesBroker = resourcesBroker
        
        super().__init__(api, *args, **kwargs)

    @permissions_ns.doc(description='Retrieve user-scope list for this resource.',
        responses={int(HTTPStatus.OK): "'Retrieved permissions list.",
                   int(HTTPStatus.NOT_FOUND): "Resource not found"},
        security='CSRF')
    @permissions_ns.marshal_list_with(user_scope_model, mask="*")
    @auth_validator()    
    def get(self, resource_id):
        '''Retrieve all community user permissions'''
        
        resource = self.resourcesBroker.get_by_id(resource_id)
        if not resource:
            abort(HTTPStatus.NOT_FOUND)

        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if not user.has_any_community_scope(id=resource.community_id, scopes=[CommunityScopeConstants.Manager, CommunityScopeConstants.Owner]):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        return self.permissionsBroker.get_all_resource_scopes(resource_id)

@permissions_ns.route('/resource/<string:resource_id>/user/<string:user_id>', endpoint="resource_user_permissions", methods=['GET','POST'])
@permissions_ns.param("resource_id", "Resource id")
@permissions_ns.param("user_id", "User id")
class ResourceUserPermissions(Resource):
    '''Get a list of resource permissions for one user and expose POST for the replace of user scopes'''
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, permissionsBroker: IUserPermissionsBroker, resourcesBroker: IResourcesBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.permissionsBroker = permissionsBroker
        self.resourcesBroker = resourcesBroker
        
        super().__init__(api, *args, **kwargs)

    @permissions_ns.doc(description='Retrieve user scopes for a resource.',
        responses={int(HTTPStatus.OK): "'Retrieved permissions list.",
                   int(HTTPStatus.NOT_FOUND): "Resource or user not found"},
        security='CSRF')
    @permissions_ns.marshal_list_with(user_scope_model, mask="*")
    @auth_validator()    
    def get(self, resource_id, user_id):
        '''Retrieve user permissions for resource'''
        
        resource = self.resourcesBroker.get_by_id(resource_id)
        if not resource:
            abort(HTTPStatus.NOT_FOUND, "Resource id not found")
            
        if not self.usersBroker.user_uid_exists(user_id):
            abort(HTTPStatus.NOT_FOUND, "User id not found")

        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        user = self.usersBroker.get_user_by_id(auth_id)        

        if user is None or user.is_not_active():            
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")        

        if not user.has_any_community_scope(id=resource.community_id, scopes=[CommunityScopeConstants.Manager, CommunityScopeConstants.Owner]):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        return self.permissionsBroker.get_user_resource_scopes_by_id(user_id=user_id, resource_id=resource_id)

    @permissions_ns.doc(description='Replace all user permissions for the resource',        
    responses={
                int(HTTPStatus.OK): "User permissions updated.", 
                int(HTTPStatus.FORBIDDEN): "Insufficient rights",
                int(HTTPStatus.NOT_FOUND): "Resource or user not found."
                },
    security='CSRF')
    @permissions_ns.expect(resource_scopes_parser)
    @auth_validator()
    def post(self, resource_id, user_id):
        '''Add/Replace user permissions'''

        resource = self.resourcesBroker.get_by_id(resource_id)
        if not resource:
            abort(HTTPStatus.NOT_FOUND, "Resource id not found")
            
        if not self.usersBroker.user_uid_exists(user_id):
            abort(HTTPStatus.NOT_FOUND, "User id not found")
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]   
        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if not user.has_any_community_scope(id=resource.community_id, scopes=[CommunityScopeConstants.Manager, CommunityScopeConstants.Owner]):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")    

        request_dict = resource_scopes_parser.parse_args()
        scopes = request_dict["scope"]
        self.permissionsBroker.replace_all_user_resource_scopes(user_id=user_id, resource_id=resource_id, scopes=scopes)

        response = jsonify(status="success", message="User permissions updated")
        response.status_code = HTTPStatus.OK
        
        return response        