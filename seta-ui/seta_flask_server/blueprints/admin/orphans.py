from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, abort
from flask import current_app as app, jsonify

from injector import inject
from http import HTTPStatus
from werkzeug.exceptions import HTTPException

from seta_flask_server.repository.interfaces import (IUsersBroker, ICommunitiesBroker, 
                                                     IUserPermissionsBroker, IMembershipsBroker,
                                                     IResourcesBroker)
from seta_flask_server.infrastructure.constants import CommunityRoleConstants, UserRoleConstants
from seta_flask_server.infrastructure.scope_constants import CommunityScopeConstants
from seta_flask_server.repository.models import EntityScope, MembershipModel

from seta_flask_server.infrastructure.clients.private_api_client import PrivateResourcesClient

from .models.orphans_dto import (community_model, user_info_model)

orphans_ns = Namespace('Community Orphans', validate=True, description='SETA Community Orphan Entities')
orphans_ns.models[user_info_model.name] = user_info_model
orphans_ns.models[community_model.name] = community_model

@orphans_ns.route("/communities", endpoint="admin_orphan_communities", methods=['GET'])
class CommunityOrphans(Resource):
    """Handles HTTP requests to URL: /admin/orphan/communities."""

    @inject
    def __init__(self, usersBroker: IUsersBroker, communitiesBroker: ICommunitiesBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.communitiesBroker = communitiesBroker
        
        super().__init__(api, *args, **kwargs)

    @orphans_ns.doc(description='Retrieve all communities without an assigned owner',
        responses={
                    int(HTTPStatus.OK): "'Retrieved communities.",
                    int(HTTPStatus.FORBIDDEN): "Insufficient rights, role 'Administrator' required"
                },
        
        security='CSRF')
    @orphans_ns.marshal_list_with(community_model)
    @jwt_required()
    def get(self):
        '''
        Retrieve all communitiers without ownership, available to sysadmins
        
        Permissions: "Administrator" role
        '''
        
        identity = get_jwt_identity()
        user_id = identity["user_id"]
        
        #verify scope
        user = self.usersBroker.get_user_by_id(user_id)        
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        if user.role.lower() != UserRoleConstants.Admin.lower():        
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        return self.communitiesBroker.get_orphans()
    
@orphans_ns.route("/communities/<string:community_id>/owner/<string:user_id>", endpoint="admin_orphan_community_owner", methods=['POST'])
@orphans_ns.param("community_id", "Community identifier")
@orphans_ns.param("user_id", "User identifier")
class CommunityOrphanOwner(Resource):
    """Handles HTTP requests to URL: /admin/orphan/communities/<community_id>/owner/<user_id>."""

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

    @orphans_ns.doc(description='Set ownership for a community',        
    responses={
                int(HTTPStatus.CREATED): "Community owner set.", 
                int(HTTPStatus.FORBIDDEN): "Insufficient rights",
                int(HTTPStatus.NOT_FOUND): "Community or user not found."
                },
    security='CSRF')
    @jwt_required()
    def post(self, community_id, user_id):
        '''
        Set owner for a community, available to sysadmin
        
        Permission scopes: "Administrator" role
        '''

        if not self.communitiesBroker.community_id_exists(community_id):
            abort(HTTPStatus.NOT_FOUND, "Community id not found")
            
        if not self.usersBroker.user_uid_exists(user_id):
            abort(HTTPStatus.NOT_FOUND, "User id not found")

        if not self.membershipsBroker.membership_exists(community_id=community_id, user_id=user_id):
            model = MembershipModel(community_id=community_id, 
                                        user_id=user_id, 
                                        role=CommunityRoleConstants.Owner)
                
            self.membershipsBroker.create_membership(model=model)
        
        scopes = [
                    CommunityScopeConstants.Owner,
                    CommunityScopeConstants.Manager,                    
                    CommunityScopeConstants.SendInvite,
                    CommunityScopeConstants.ApproveMembershipRequest,
                    CommunityScopeConstants.CreateResource
                        ]

        self.permissionsBroker.replace_all_user_community_scopes(user_id=user_id, community_id=community_id, scopes=scopes)

        response = jsonify(status="success", message="New community owner added")
        response.status_code = HTTPStatus.CREATED
        
        return response

@orphans_ns.route("/resources", endpoint="admin_orphan_resources", methods=['GET'])
class ResourceOrphans(Resource):
    """Handles HTTP requests to URL: /admin/orphan/resources."""

    @inject
    def __init__(self, usersBroker: IUsersBroker, resourcesBroker: IResourcesBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.resourcesBroker = resourcesBroker
        
        super().__init__(api, *args, **kwargs)

    @orphans_ns.doc(description='Retrieve all resources without an assigned community',
        responses={
                    int(HTTPStatus.OK): "'Retrieved resources.",
                    int(HTTPStatus.FORBIDDEN): "Insufficient rights, role 'Administrator' required"
                },
        
        security='CSRF')
    @jwt_required()
    def get(self):
        '''
        Retrieve all resources existing in ElasticSearch, but not having a database entry, available to sysadmins
        
        Permissions: "Administrator" role
        '''
        
        identity = get_jwt_identity()
        user_id = identity["user_id"]
        
        #verify scope
        user = self.usersBroker.get_user_by_id(user_id)        
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        if user.role.lower() != UserRoleConstants.Admin.lower():        
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        try:
            client = PrivateResourcesClient()
            codes = client.all()

            if codes is not None and len(codes) > 0:
                resources = self.resourcesBroker.get_all()

                return jsonify(list(filter(lambda code: not any(r.resource_id.lower() == code.lower() for r in resources),codes )))

        except HTTPException:
            raise
        except:
            app.logger.exception("CommunityResourceList->post")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)

        return None