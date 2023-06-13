from flask import current_app as app, jsonify
from flask_jwt_extended import get_jwt_identity

from flask_restx import Namespace, Resource, abort

from injector import inject

from seta_flask_server.repository.models import MembershipModel, EntityScope
from seta_flask_server.repository.interfaces import IMembershipsBroker, IUsersBroker, ICommunitiesBroker, IUserPermissionsBroker
from seta_flask_server.infrastructure.decorators import auth_validator
from seta_flask_server.infrastructure.scope_constants import CommunityScopeConstants
from seta_flask_server.infrastructure.constants import CommunityMembershipConstants

from .models.membership_dto import (membership_model, update_membership_parser, user_info_model)

from http import HTTPStatus

membership_ns = Namespace('Community Memberships', validate=True, description='SETA Community Memberships')
membership_ns.models[user_info_model.name] = user_info_model
membership_ns.models[membership_model.name] = membership_model

@membership_ns.route('/<string:community_id>/memberships', endpoint="memberships", methods=['GET', 'POST'])
@membership_ns.param("community_id", "Community id")
class MembershipList(Resource):
    '''Get a list of community memberships and expose POST for new member'''
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, membershipsBroker: IMembershipsBroker, communitiesBroker: ICommunitiesBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.membershipsBroker = membershipsBroker
        self.communitiesBroker = communitiesBroker
        
        super().__init__(api, *args, **kwargs)
        
    @membership_ns.doc(description='Retrieve membership list for this community.',
        responses={int(HTTPStatus.OK): "'Retrieved membership list.",
                   int(HTTPStatus.NOT_FOUND): "Community not found"},
        security='CSRF')
    @membership_ns.marshal_list_with(membership_model, mask="*")
    @auth_validator()    
    def get(self, community_id):
        '''Retrieve community memberships, available to any member of this community'''        
        
        if not self.communitiesBroker.community_id_exists(community_id):
            abort(HTTPStatus.NOT_FOUND)

        identity = get_jwt_identity()
        auth_id = identity["user_id"]        
     
        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        if not self.membershipsBroker.get_membership(community_id=community_id, user_id=auth_id):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights. The user has to be part of this community")
        
        memberships = self.membershipsBroker.get_memberships_by_community_id(community_id)

        for membership in memberships:
            member = self.usersBroker.get_user_by_id(membership.user_id, load_scopes=False)
            if member:
                membership.user_info = member.user_info

        return memberships
    
    @membership_ns.doc(description='Add new member to an opened community.',        
        responses={int(HTTPStatus.CREATED): "Added new member.", 
                   int(HTTPStatus.FORBIDDEN): "Community is not opened",
                   int(HTTPStatus.NOT_FOUND): "Community not found",
                   int(HTTPStatus.CONFLICT): "Member already exists."},
        security='CSRF')
    @auth_validator()
    def post(self, community_id):
        '''Create a member for an opened community, available to any user'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]                
            
        community = self.communitiesBroker.get_by_id(community_id)
        if community is None:
            abort(HTTPStatus.NOT_FOUND)

        if community.membership != CommunityMembershipConstants.Opened:
            abort(HTTPStatus.FORBIDDEN, "Community is not opened, a membership request is required")
            
        member_exists = False        
        try:
            
            member_exists = self.membershipsBroker.membership_exists(community_id, auth_id)
                       
            if not member_exists:
                model = MembershipModel(community_id=community_id, user_id=auth_id)
                
                scopes = [
                    EntityScope(user_id=model.user_id,  id=model.community_id, scope=CommunityScopeConstants.CreateResource).to_community_json()
                          ]
                self.membershipsBroker.create_membership(model=model, community_scopes=scopes)
        except:
            app.logger.exception("MembershipList->post")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)
        
        if member_exists:
            error = f"User is already part of this community."
            abort(HTTPStatus.CONFLICT, error, status="fail")
                
        response = jsonify(status="success", message="New member added")
        response.status_code = HTTPStatus.CREATED
        
        return response
    
@membership_ns.route('/<string:community_id>/memberships/<string:user_id>', endpoint="manage_membership", methods=['GET', 'PUT', 'DELETE'])
@membership_ns.param("community_id", "Community identifier")
@membership_ns.param("user_id", "User identifier")
class MembershipManagement(Resource):
    """Handles membership management"""

    @inject
    def __init__(self, usersBroker: IUsersBroker, membershipsBroker: IMembershipsBroker, permissionsBroker: IUserPermissionsBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.membershipsBroker = membershipsBroker
        self.permissionsBroker = permissionsBroker
        
        super().__init__(api, *args, **kwargs)
        
    @membership_ns.doc(description='Retrieve user membership',        
        responses={int(HTTPStatus.OK): "Retrieved membership.",
                int(HTTPStatus.NOT_FOUND): "Membership not found."
                },
        security='CSRF')
    @membership_ns.marshal_with(membership_model, mask="*")
    @auth_validator()
    def get(self, community_id, user_id):
        '''Retrieve membership, available to community managers'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if auth_id != user_id and not user.has_any_community_scope(id=community_id, scopes=[CommunityScopeConstants.Manager, CommunityScopeConstants.Owner]):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        membership = self.membershipsBroker.get_membership(community_id, user_id)
        
        if membership is None:
            abort(HTTPStatus.NOT_FOUND)

        member = self.usersBroker.get_user_by_id(membership.user_id, load_scopes=False)
        if member:
            membership.user_info = member.user_info
        
        return membership
    
    @membership_ns.doc(description='Update membership fields',        
    responses={
                int(HTTPStatus.OK): "Membership updated.", 
                int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/manager' required",
                int(HTTPStatus.NOT_FOUND): "Membership not found."
                },
    security='CSRF')
    @membership_ns.expect(update_membership_parser)
    @auth_validator()
    def put(self, community_id, user_id):
        '''Update a community membership, available to community managers'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
                
        #verify scope
        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if not user.has_any_community_scope(id=community_id, scopes=[CommunityScopeConstants.Manager, CommunityScopeConstants.Owner]):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        if not self.membershipsBroker.membership_exists(community_id, user_id):
            abort(HTTPStatus.NOT_FOUND)
        
        
        membership_dict = update_membership_parser.parse_args()
        
        try:   
            #TODO: check the owner role?
            model = MembershipModel(community_id=community_id, user_id=user_id, 
                                    role=membership_dict["role"], status=membership_dict["status"])
            
            self.membershipsBroker.update_membership(model)
        except:
            app.logger.exception("Membership->put")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)   
            
        message = "Membership updated."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK
        
        return response
    
    @membership_ns.doc(description='Remove membership',        
    responses={
                int(HTTPStatus.OK): "Membership removed.", 
                int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/edit' required",
                int(HTTPStatus.NOT_FOUND): "Membership not found.",
                int(HTTPStatus.CONFLICT): "Cannot remove the only owner."
                },
    security='CSRF')
    @auth_validator()
    def delete(self, community_id, user_id):
        '''Remove a membership, available to community managers'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        #verify scope
        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if not user.has_any_community_scope(id=community_id, scopes=[CommunityScopeConstants.Manager, CommunityScopeConstants.Owner]):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        if not self.membershipsBroker.membership_exists(community_id, user_id):
            abort(HTTPStatus.NOT_FOUND)

        #verify owner scope for the target user_id
        scopes = self.permissionsBroker.get_user_community_scopes_by_id(user_id=user_id, community_id=community_id)
        if any(cs.scope == CommunityScopeConstants.Owner for cs in scopes):

            #only an owner can remove another owner (including himself)
            if not user.has_community_scope(id=community_id, scope=CommunityScopeConstants.Owner):
                abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

            #check if it's not the only owner of this community
            community_scopes = self.permissionsBroker.get_all_community_scopes(community_id=community_id)
            if not any(cs.user_id != user_id and cs.scope == CommunityScopeConstants.Owner for cs in community_scopes):
                abort(HTTPStatus.CONFLICT, "Cannot remove the only owner for this community.")
                    
        try:                
            self.membershipsBroker.delete_membership(community_id=community_id, user_id=user_id)
        except:
            app.logger.exception("Membership->delete")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)   
            
        message = "Membership deleted."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK
        
        return response