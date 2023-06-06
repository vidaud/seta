from flask import current_app as app, jsonify
from flask_jwt_extended import get_jwt_identity

from flask_restx import Namespace, Resource, abort

from injector import inject

from seta_flask_server.repository.models import MembershipModel, MembershipRequestModel, EntityScope
from seta_flask_server.repository.interfaces import IMembershipsBroker, IUsersBroker, ICommunitiesBroker, IUserPermissionsBroker
from seta_flask_server.infrastructure.decorators import auth_validator
from .models.membership_dto import (membership_model, update_membership_parser, 
                                    request_model, new_request_parser, update_request_parser)
from seta_flask_server.infrastructure.scope_constants import CommunityScopeConstants
from seta_flask_server.infrastructure.constants import CommunityMembershipConstants, RequestStatusConstants

from http import HTTPStatus

membership_ns = Namespace('Community Memberships', validate=True, description='SETA Community Memberships')
membership_ns.models[membership_model.name] = membership_model
membership_ns.models[request_model.name] = request_model

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
        '''Retrieve community memberships'''        
        
        if not self.communitiesBroker.community_id_exists(community_id):
            abort(HTTPStatus.NOT_FOUND)

        identity = get_jwt_identity()
        auth_id = identity["user_id"]        
     
        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        if not self.membershipsBroker.get_membership(community_id=community_id, user_id=auth_id):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights. The user has to be part of this community")
        
        return self.membershipsBroker.get_memberships_by_community_id(community_id)
    
    @membership_ns.doc(description='Add new member to an opened community.',        
        responses={int(HTTPStatus.CREATED): "Added new member.", 
                   int(HTTPStatus.FORBIDDEN): "Community is not opened",
                   int(HTTPStatus.NOT_FOUND): "Community not found",
                   int(HTTPStatus.CONFLICT): "Member already exists."},
        security='CSRF')
    @auth_validator()
    def post(self, community_id):
        '''Create a member for an opened community'''
        
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
    
@membership_ns.route('/<string:community_id>/memberships/<string:user_id>', endpoint="membership", methods=['GET', 'PUT', 'DELETE'])
@membership_ns.param("community_id", "Community identifier")
@membership_ns.param("user_id", "User identifier")
class Membership(Resource):
    """Handles HTTP requests to URL: /communities/{community_id}/memberships/{user_id}."""

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
        '''Retrieve membership'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if auth_id != user_id and not user.has_any_community_scope(id=community_id, scopes=[CommunityScopeConstants.Manager, CommunityScopeConstants.Owner]):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        community = self.membershipsBroker.get_membership(community_id, user_id)
        
        if community is None:
            abort(HTTPStatus.NOT_FOUND)
        
        return community
    
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
        '''Update a community membership'''
        
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
        '''Remove a membership'''
        
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
            
        message = "Membership updated."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK
        
        return response
    
@membership_ns.route('/<string:community_id>/requests', endpoint="requests", methods=['GET', 'POST'])
@membership_ns.param("community_id", "Community identifier")
class RequestList(Resource):
    '''Get a list of community requests and expose POST for new request'''
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, membershipsBroker: IMembershipsBroker, communitiesBroker: ICommunitiesBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.membershipsBroker = membershipsBroker
        self.communitiesBroker = communitiesBroker
        
        super().__init__(api, *args, **kwargs)
        
    @membership_ns.doc(description='Retrieve request list for this community.',
        responses={int(HTTPStatus.OK): "'Retrieved request list.",
                   int(HTTPStatus.NOT_FOUND): "Community not found"},
        security='CSRF')
    @membership_ns.marshal_list_with(request_model, mask="*")
    @auth_validator()    
    def get(self, community_id):
        '''Retrieve community requests'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        scopes=[CommunityScopeConstants.Owner, CommunityScopeConstants.Manager, CommunityScopeConstants.ApproveMembershipRequest]
        if not user.has_any_community_scope(id=community_id, scopes=scopes):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.") 
        
        if not self.communitiesBroker.community_id_exists(community_id):
            abort(HTTPStatus.NOT_FOUND)
        
        return self.membershipsBroker.get_requests_by_community_id(community_id)
    
    @membership_ns.doc(description='Add new request for the community for the authorized user.',        
        responses={int(HTTPStatus.CREATED): "Added new request.", 
                   int(HTTPStatus.NOT_FOUND): "Community not found",
                   int(HTTPStatus.CONFLICT): "Member or request already exists."},
        security='CSRF')
    @membership_ns.expect(new_request_parser)
    @auth_validator()
    def post(self, community_id):
        '''Create a community membership request'''
        
        identity = get_jwt_identity()
        user_id = identity["user_id"]
              
        
        member_exists = False
        request_exists = False
        community_exists = False
        
        request_dict = new_request_parser.parse_args()
                
        
        try:
            community_exists = self.communitiesBroker.community_id_exists(community_id)
            
            if community_exists:
                member_exists = self.membershipsBroker.membership_exists(community_id=community_id, user_id=user_id)
                        
                if not member_exists:
                    model = MembershipRequestModel(community_id=community_id, requested_by=user_id, message=request_dict["message"])
                    
                    request_exists = not self.membershipsBroker.create_request(model)
        except:
            app.logger.exception("MembershipList->post")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)
            
        if not community_exists:
            abort(HTTPStatus.NOT_FOUND)
        
        if member_exists:
            error = f"User is already part of this community."
            abort(HTTPStatus.CONFLICT, error, status="fail")
            
        if request_exists:
            error = f"User has already sent a request to this community."
            abort(HTTPStatus.CONFLICT, error, status="fail")
                
        response = jsonify(status="success", message="New membership request added")
        response.status_code = HTTPStatus.CREATED
        
        return response
    
@membership_ns.route('/<string:community_id>/requests/<string:user_id>', endpoint="request", methods=['GET', 'PUT'])
@membership_ns.param("community_id", "Community identifier")
@membership_ns.param("user_id", "User identifier")
class Request(Resource):
    """Handles HTTP requests to URL: /communities/{community_id}/requests/{user_id}."""

    @inject
    def __init__(self, usersBroker: IUsersBroker, membershipsBroker: IMembershipsBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.membershipsBroker = membershipsBroker
        
        super().__init__(api, *args, **kwargs)
        
    @membership_ns.doc(description='Retrieve user request for the community.',
    responses={int(HTTPStatus.OK): "'Retrieved user request.",
               int(HTTPStatus.NOT_FOUND): "Request not found."},
    security='CSRF')
    @membership_ns.marshal_with(request_model, mask="*")
    @auth_validator()    
    def get(self, community_id, user_id):
        '''Retrieve user request'''
                
        if not self.membershipsBroker.request_exists(community_id=community_id, user_id=user_id):
            abort(HTTPStatus.NOT_FOUND)

        #verify scope
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        scopes = [CommunityScopeConstants.ApproveMembershipRequest, CommunityScopeConstants.Manager, CommunityScopeConstants.Owner]
        if not user.has_any_community_scope(id=community_id, scopes=scopes):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        return self.membershipsBroker.get_request(community_id=community_id, user_id=user_id)
    
    @membership_ns.doc(description='Approve/reject request',        
    responses={
                int(HTTPStatus.OK): "Request updated.", 
                int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/membership/approve' required",
                int(HTTPStatus.NOT_FOUND): "Request not found.",
                int(HTTPStatus.CONFLICT): "Request status already set"
                },
    security='CSRF')
    @membership_ns.expect(update_request_parser)
    @auth_validator()
    def put(self, community_id, user_id):
        '''Update a request'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        #verify scope
        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        scopes = [CommunityScopeConstants.ApproveMembershipRequest, CommunityScopeConstants.Manager, CommunityScopeConstants.Owner]
        if not user.has_any_community_scope(id=community_id, scopes=scopes):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
                
        if not self.membershipsBroker.request_exists(community_id=community_id, user_id=user_id):
            abort(HTTPStatus.NOT_FOUND)
        
        request_dict = update_request_parser.parse_args()
        status = request_dict["status"]

        request = self.membershipsBroker.get_request(community_id=community_id, user_id=user_id)
            
        if request.status.lower() == status.lower():
            abort(HTTPStatus.CONFLICT, f"Request was aleardy {status}")

                   
        model = MembershipRequestModel(community_id=community_id, requested_by=user_id, status=status, reviewed_by=auth_id)        

        if status == RequestStatusConstants.Approved:
            scopes = [
                EntityScope(user_id=user_id,  id=community_id, scope=CommunityScopeConstants.CreateResource).to_community_json()
                ]
            self.membershipsBroker.approve_request(model=model, community_scopes=scopes)
        else:
            self.membershipsBroker.reject_request(model)
           
        
        message = f"Request {status}."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK
        
        return response