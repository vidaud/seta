from flask import current_app, jsonify
from flask_jwt_extended import get_jwt_identity

from flask_restx import Namespace, Resource, abort
from http import HTTPStatus
from injector import inject

from seta_flask_server.infrastructure.decorators import auth_validator
from seta_flask_server.repository.interfaces import IUsersBroker, IUserPermissionsBroker, ICommunitiesBroker, IResourcesBroker
from seta_flask_server.repository.models import EntityScope, SystemScope
from seta_flask_server.infrastructure.scope_constants import CommunityScopeConstants

from seta_flask_server.blueprints.communities.models.permissions_dto import user_scope_model, community_scopes_parser

permissions_ns = Namespace('Community User Permissions', validate=True, description='SETA Community User Permissions')
permissions_ns.models[user_scope_model.name] = user_scope_model

@permissions_ns.route('/community/<string:community_id>', endpoint="community_permission_list", methods=['GET'])
@permissions_ns.param("community_id", "Community id")
class CommunityPermissionList(Resource):
    '''Get a list of all community permissions'''
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, permissionsBroker: IUserPermissionsBroker, communitiesBroker: ICommunitiesBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.permissionsBroker = permissionsBroker
        self.communitiesBroker = communitiesBroker
        
        super().__init__(api, *args, **kwargs)

    @permissions_ns.doc(description='Retrieve user-scope list for this community.',
        responses={int(HTTPStatus.OK): "'Retrieved permissions list.",
                   int(HTTPStatus.NO_CONTENT): "Community not found"},
        security='CSRF')
    @permissions_ns.marshal_list_with(user_scope_model, mask="*")
    @auth_validator()    
    def get(self, community_id):
        '''Retrieve all community user permissions'''
        
        if not self.communitiesBroker.community_id_exists(community_id):
            return '', HTTPStatus.NO_CONTENT

        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None:
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if not user.has_community_scope(id=community_id, scope=CommunityScopeConstants.Manager):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        return self.permissionsBroker.get_all_community_scopes(community_id=community_id)

@permissions_ns.route('/community/<string:community_id>/user/<string:user_id>', endpoint="community_user_permissions", methods=['GET','POST'])
@permissions_ns.param("community_id", "Community id")
@permissions_ns.param("user_id", "User id")
class CommunityUserPermissions(Resource):
    '''Get a list of community permissions for one user and expose POST for the replace of user scopes'''
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, permissionsBroker: IUserPermissionsBroker, communitiesBroker: ICommunitiesBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.permissionsBroker = permissionsBroker
        self.communitiesBroker = communitiesBroker
        
        super().__init__(api, *args, **kwargs)

    @permissions_ns.doc(description='Retrieve user scopes for a community.',
        responses={int(HTTPStatus.OK): "'Retrieved permissions list.",
                   int(HTTPStatus.NO_CONTENT): "Community not found"},
        security='CSRF')
    @permissions_ns.marshal_list_with(user_scope_model, mask="*")
    @auth_validator()    
    def get(self, community_id, user_id):
        '''Retrieve user permissions for community'''
        
        if not self.communitiesBroker.community_id_exists(community_id):
            return '', HTTPStatus.NO_CONTENT

        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        user = self.usersBroker.get_user_by_id(auth_id)        

        if user is None:            
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")        

        if (not user.has_community_scope(id=community_id, scope=CommunityScopeConstants.Manager)):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        return self.permissionsBroker.get_all_user_community_scopes(community_id=community_id, user_id=user_id)

    @permissions_ns.doc(description='Replace all user permissions for the community',        
    responses={
                int(HTTPStatus.OK): "User permissions updated.", 
                int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/edit' required",
                int(HTTPStatus.NO_CONTENT): "Community not found."
                },
    security='CSRF')
    @permissions_ns.expect(community_scopes_parser)
    @auth_validator()
    def post(self, community_id, user_id):
        '''Add/Replace user permissions'''

        if not self.communitiesBroker.community_id_exists(community_id):
            return '', HTTPStatus.NO_CONTENT
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]   
        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None:
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if not user.has_community_scope(id=community_id, scope=CommunityScopeConstants.Manager):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")    

        request_dict = community_scopes_parser.parse_args()
        scopes = request_dict["scope"]

        scope_list = []
        for scope in scopes:
            scope_list.append(EntityScope(user_id=user_id, id=community_id, scope=scope))

        self.permissionsBroker.replace_all_user_community_scopes(user_id=user_id, community_id=community_id, scopes=scope_list)

        response = jsonify(status="success", message="User permissions updated")
        response.status_code = HTTPStatus.OK
        
        return response
        