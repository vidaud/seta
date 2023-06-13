from flask import jsonify
from flask_jwt_extended import get_jwt_identity

from flask_restx import Namespace, Resource, abort
from http import HTTPStatus
from injector import inject

from seta_flask_server.infrastructure.decorators import auth_validator
from seta_flask_server.repository.interfaces import IUsersBroker, IUserPermissionsBroker, ICommunitiesBroker, IMembershipsBroker
from seta_flask_server.infrastructure.scope_constants import CommunityScopeConstants

from seta_flask_server.blueprints.communities.models.permissions_dto import user_scopes_model, user_info_model, community_scopes_parser
from .helpers.scopes_helper import group_user_scopes

permissions_ns = Namespace('Community User Permissions', validate=True, description='SETA Community User Permissions')
permissions_ns.models[user_info_model.name] = user_info_model
permissions_ns.models[user_scopes_model.name] = user_scopes_model

@permissions_ns.route('/community/<string:community_id>', endpoint="community_permission_list", methods=['GET'])
@permissions_ns.param("community_id", "Community identifier")
class CommunityPermissionList(Resource):
    ''' Get the community permissions for all members.'''
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, 
                 permissionsBroker: IUserPermissionsBroker, 
                 communitiesBroker: ICommunitiesBroker,                  
                 api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.permissionsBroker = permissionsBroker
        self.communitiesBroker = communitiesBroker        
        
        super().__init__(api, *args, **kwargs)

    @permissions_ns.doc(description='Retrieve full user-scope list for this community.',
        responses={int(HTTPStatus.OK): "'Retrieved permissions list.",
                   int(HTTPStatus.NOT_FOUND): "Community not found"},
        security='CSRF')
    @permissions_ns.marshal_list_with(user_scopes_model, mask="*")
    @auth_validator()    
    def get(self, community_id):
        '''
        Retrieve community permissions for all members, available to community managers.

        Permission scopes: any of "/seta/community/manager", "/seta/community/owner"
        '''
        
        if not self.communitiesBroker.community_id_exists(community_id):
            abort(HTTPStatus.NOT_FOUND)

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not user.has_any_community_scope(id=community_id, scopes=[CommunityScopeConstants.Manager, CommunityScopeConstants.Owner]):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        scopes = self.permissionsBroker.get_all_community_scopes(community_id=community_id)
        
        return group_user_scopes(scopes=scopes, usersBroker=self.usersBroker)


@permissions_ns.route('/community/<string:community_id>/user/<string:user_id>', endpoint="community_user_permissions", methods=['GET','POST'])
@permissions_ns.param("community_id", "Community identifier")
@permissions_ns.param("user_id", "User identifier")
class CommunityUserPermissions(Resource):
    '''Get a list of community permissions for one user and expose POST for the replace of user scopes'''
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, 
                 permissionsBroker: IUserPermissionsBroker, 
                 communitiesBroker: ICommunitiesBroker, 
                 membershipsBroker: IMembershipsBroker,
                 api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.permissionsBroker = permissionsBroker
        self.communitiesBroker = communitiesBroker
        self.membershipsBroker = membershipsBroker
        
        super().__init__(api, *args, **kwargs)

    @permissions_ns.doc(description='Retrieve community permissions for a member.',
        responses={int(HTTPStatus.OK): "'Retrieved permissions list.",
                   int(HTTPStatus.NOT_FOUND): "Community or user not found"},
        security='CSRF')
    @permissions_ns.marshal_with(user_scopes_model, mask="*")
    @auth_validator()    
    def get(self, community_id, user_id):
        '''
        Retrieve community permissions for a member, available to community managers.

        Permission scopes: any of "/seta/community/manager", "/seta/community/owner"
        '''
        
        if not self.communitiesBroker.community_id_exists(community_id):
            abort(HTTPStatus.NOT_FOUND, "Community id not found")
            
        if not self.usersBroker.user_uid_exists(user_id):
            abort(HTTPStatus.NOT_FOUND, "User id not found")        

        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        user = self.usersBroker.get_user_by_id(auth_id)        

        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")        

        if not user.has_any_community_scope(id=community_id, scopes=[CommunityScopeConstants.Manager, CommunityScopeConstants.Owner]):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        scopes = self.permissionsBroker.get_user_community_scopes_by_id(community_id=community_id, user_id=user_id)
        list =  group_user_scopes(scopes=scopes, usersBroker=self.usersBroker)

        #it should be only one entry
        if len(list) > 0:
            return list[0]

        return None

    @permissions_ns.doc(description='Manage community permissions for a member',        
    responses={
                int(HTTPStatus.OK): "User permissions updated.", 
                int(HTTPStatus.FORBIDDEN): "Insufficient rights",
                int(HTTPStatus.NOT_FOUND): "Community or user not found.",
                int(HTTPStatus.BAD_REQUEST): "User have to be a member of the community.",
                },
    security='CSRF')
    @permissions_ns.expect(community_scopes_parser)
    @auth_validator()
    def post(self, community_id, user_id):
        '''
        Manage community permissions for a member, available to community managers
        
        Permission scopes: any of "/seta/community/manager", "/seta/community/owner"
        Only an owner can edit the permissions of another owner!
        '''

        if not self.communitiesBroker.community_id_exists(community_id):
            abort(HTTPStatus.NOT_FOUND, "Community id not found")
            
        if not self.usersBroker.user_uid_exists(user_id):
            abort(HTTPStatus.NOT_FOUND, "User id not found")

        if not self.membershipsBroker.membership_exists(community_id=community_id, user_id=user_id):
            abort(HTTPStatus.BAD_REQUEST, "User have to be a member of the community!")
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]   
        user = self.usersBroker.get_user_by_id(auth_id)

        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not user.has_any_community_scope(id=community_id, scopes=[CommunityScopeConstants.Manager, CommunityScopeConstants.Owner]):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")    

        request_dict = community_scopes_parser.parse_args()
        scopes = request_dict["scope"]

        #verify owner scope in the list
        if scopes and CommunityScopeConstants.Owner in scopes:
            #only an owner can edit permissions for another owner
            if not user.has_community_scope(id=community_id, scope=CommunityScopeConstants.Owner):
                abort(HTTPStatus.FORBIDDEN, "Insufficient rights, you must be an owner of the community.")

        self.permissionsBroker.replace_all_user_community_scopes(user_id=user_id, community_id=community_id, scopes=scopes)

        response = jsonify(status="success", message="User permissions updated")
        response.status_code = HTTPStatus.OK
        
        return response