from flask import current_app as app, jsonify
from flask_jwt_extended import get_jwt_identity

from flask_restx import Namespace, Resource, abort

from injector import inject
from http import HTTPStatus

from seta_flask_server.repository.models import CommunityChangeRequestModel
from seta_flask_server.repository.interfaces import ICommunityChangeRequestsBroker, IUsersBroker, IResourceChangeRequestsBroker
from seta_flask_server.infrastructure.decorators import auth_validator
from seta_flask_server.infrastructure.scope_constants import CommunityScopeConstants, SystemScopeConstants
from seta_flask_server.infrastructure.constants import RequestStatusConstants, UserRoleConstants, CommunityRequestFieldConstants, CommunityMembershipConstants

from .models.community_dto import(new_change_request_parser, update_change_request_parser, 
                    change_request_model, resource_change_request_model, all_change_requests_model, user_info_model)

community_change_request_ns = Namespace('Community Change Requests', validate=True, description='SETA Community Change Requests')
community_change_request_ns.models[user_info_model.name] = user_info_model
community_change_request_ns.models[change_request_model.name] = change_request_model
community_change_request_ns.models[resource_change_request_model.name] = resource_change_request_model
community_change_request_ns.models[all_change_requests_model.name] = all_change_requests_model

@community_change_request_ns.route('/change-requests/pending', endpoint="community_change_request_list", methods=['GET', 'POST'])
class CommunityChangeRequestList(Resource):
    '''Get list of all pending change requests for communities'''
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, changeRequestsBroker: ICommunityChangeRequestsBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.changeRequestsBroker = changeRequestsBroker
        
        super().__init__(api, *args, **kwargs)
        
    @community_change_request_ns.doc(description='Retrieve all pending change requests issued for communities',
        responses={
                    int(HTTPStatus.OK): "'Retrieved pending change requests.",
                    int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/change_request/approve' required"
                },
        
        security='CSRF')
    @community_change_request_ns.marshal_list_with(change_request_model, mask="*")
    @auth_validator()
    def get(self):
        '''
        Retrieve all pending change requests for communities, available to sysadmins
        
        Permissions: either scope "/seta/community/change_request/approve" or "Administrator" role
        '''
        
        identity = get_jwt_identity()
        user_id = identity["user_id"]
        
        #verify scope
        user = self.usersBroker.get_user_by_id(user_id)        
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        hasApproveRight = user.role.lower() == UserRoleConstants.Admin.lower() or user.has_system_scope(SystemScopeConstants.ApproveCommunityChangeRequest)        
        if not hasApproveRight:        
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        requests = self.changeRequestsBroker.get_all_pending()

        for request in requests:
            requested_by = self.usersBroker.get_user_by_id(request.requested_by, load_scopes=False)
            if requested_by:
                request.requested_by_info = requested_by.user_info

            if request.reviewed_by:
                reviewed_by = self.usersBroker.get_user_by_id(request.reviewed_by, load_scopes=False)
                if reviewed_by:
                    request.reviewed_by_info = reviewed_by.user_info

        return requests
    
@community_change_request_ns.route('/<string:community_id>/change-requests', endpoint="community_create_change_request", methods=['GET','POST'])
@community_change_request_ns.param("community_id", "Community identifier") 
class CommunityCreateChangeRequest(Resource):
    """Handles HTTP POST requests to URL: /communities/{community_id}/change-requests."""
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, 
                 changeRequestsBroker: ICommunityChangeRequestsBroker, 
                 resourceRequestsBroker: IResourceChangeRequestsBroker, 
                 api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.changeRequestsBroker = changeRequestsBroker
        self.resourceRequestsBroker = resourceRequestsBroker
        
        super().__init__(api, *args, **kwargs)
        
    @community_change_request_ns.doc(description='Create a change request for a community field.',        
        responses={int(HTTPStatus.CREATED): "New change request created.", 
                   int(HTTPStatus.CONFLICT): "Community has already a pending change request for this field",
                   int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/manager' or 'community/owner' required",
                   int(HTTPStatus.BAD_REQUEST): "Filed name or input values are wrong"},
        security='CSRF')
    @community_change_request_ns.expect(new_change_request_parser)
    @auth_validator()
    def post(self, community_id):
        '''
        Create a community change request, available to community managers

        Permission scopes: either '/seta/community/owner' or '/seta/community/manager'
        '''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
            
        if not user.has_any_community_scope(id=community_id, scopes=[CommunityScopeConstants.Manager, CommunityScopeConstants.Owner]):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        request_dict = new_change_request_parser.parse_args()
        
        field_name = request_dict["field_name"]
        if self.changeRequestsBroker.has_pending_field(community_id=community_id, field_name=field_name):
            abort(HTTPStatus.CONFLICT, "Community has already a pending change request for this field")

        #validate field values
        new_value=request_dict["new_value"]
        old_value=request_dict["old_value"]

        match field_name:
            case CommunityRequestFieldConstants.Membership:
                if not new_value in CommunityMembershipConstants.List:
                    abort(HTTPStatus.BAD_REQUEST, f"New value has to be one of {CommunityMembershipConstants.List}")
                if not old_value in CommunityMembershipConstants.List:
                    abort(HTTPStatus.BAD_REQUEST, f"Old value has to be one of {CommunityMembershipConstants.List}")
        
        model = CommunityChangeRequestModel(community_id = community_id, field_name = field_name,
                                            new_value = new_value, old_value = old_value,
                                            status = RequestStatusConstants.Pending, requested_by = auth_id)
        try:
            self.changeRequestsBroker.create(model)
        except:
            app.logger.exception("CreateChangeRequest->post")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)

        message = "New change request added"

        if app.config["AUTO_APPROVE_CHANGE_REQUEST"]:
            try:  
                model.status = RequestStatusConstants.Approved
                model.reviewed_by = 'system'

                self.changeRequestsBroker.update(model)                

                message = "Change request approved!"
            except:
                app.logger.exception("CreateChangeRequest->auto_approve")            
                
        response = jsonify(status="success", message = message)
        response.status_code = HTTPStatus.CREATED
        
        return response
    
    @community_change_request_ns.doc(description='Retrieve all change requests for a community',
        responses={
                    int(HTTPStatus.OK): "'Retrieved change requests.",
                    int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/manager' or 'community/owner' required"
                },
        
        security='CSRF')
    @community_change_request_ns.marshal_with(all_change_requests_model, mask="*")
    @auth_validator()
    def get(self, community_id):
        '''
        Retrieve all change requests for a community, available to community managers

        Permission scopes: either '/seta/community/owner' or '/seta/community/manager'
        '''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
            
        if not user.has_any_community_scope(id=community_id, scopes=[CommunityScopeConstants.Manager, CommunityScopeConstants.Owner]):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        community_change_requests = self.changeRequestsBroker.get_all_by_community_id(community_id)
        resource_change_requests = self.resourceRequestsBroker.get_all_by_community_id(community_id)

        #add community crs infos
        for community_request in community_change_requests:
            requested_by = self.usersBroker.get_user_by_id(community_request.requested_by, load_scopes=False)
            if requested_by:
                community_request.requested_by_info = requested_by.user_info

            if community_request.reviewed_by:
                reviewed_by = self.usersBroker.get_user_by_id(community_request.reviewed_by, load_scopes=False)
                if reviewed_by:
                    community_request.reviewed_by_info = reviewed_by.user_info

        #add resourse crs infos
        for resource_request in resource_change_requests:
            requested_by = self.usersBroker.get_user_by_id(resource_request.requested_by, load_scopes=False)
            if requested_by:
                resource_request.requested_by_info = requested_by.user_info

            if resource_request.reviewed_by:
                reviewed_by = self.usersBroker.get_user_by_id(resource_request.reviewed_by, load_scopes=False)
                if reviewed_by:
                    resource_request.reviewed_by_info = reviewed_by.user_info
        
        return {
            "community_change_requests": community_change_requests,
            "resource_change_requests":  resource_change_requests
        } 
   
@community_change_request_ns.route('/<string:community_id>/change-requests/<string:request_id>', endpoint="community_change_request", methods=['GET', 'PUT'])
@community_change_request_ns.param("community_id", "Community identifier") 
@community_change_request_ns.param("request_id", "Change request identifier")
class CommunityChangeRequest(Resource):
    """Handles HTTP requests to URL: /communities/{community_id}/change-requests/{request_id}."""
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, changeRequestsBroker: ICommunityChangeRequestsBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.changeRequestsBroker = changeRequestsBroker
        
        super().__init__(api, *args, **kwargs)
        
    @community_change_request_ns.doc(description='Retrieve a change request for a community.',
    responses={int(HTTPStatus.OK): "'Retrieved change request.",
               int(HTTPStatus.NOT_FOUND): "Request not found.",
               int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/change_request/approve' required"
               },
    security='CSRF')
    @community_change_request_ns.marshal_with(change_request_model, mask="*")
    @auth_validator()    
    def get(self, community_id, request_id):
        '''
        Retrieve a community change request, available to sysadmins and initiator

        Permissions: scope '/seta/community/change_request/approve' or "Administrator" role or requested_by == authenticated_id
        '''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        request = self.changeRequestsBroker.get_request(community_id=community_id, request_id=request_id)
        
        if request is None:
            abort(HTTPStatus.NOT_FOUND)

        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        #if not the initiator of the request, verify ApproveChangeRequest scope
        if request.requested_by != auth_id:
            hasApproveRight = user.role.lower() == UserRoleConstants.Admin.lower() or user.has_system_scope(SystemScopeConstants.ApproveCommunityChangeRequest)
            if not hasApproveRight:       
                abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        requested_by = self.usersBroker.get_user_by_id(request.requested_by, load_scopes=False)
        if requested_by:
            request.requested_by_info = requested_by.user_info

        if request.reviewed_by:
            reviewed_by = self.usersBroker.get_user_by_id(request.reviewed_by, load_scopes=False)
            if reviewed_by:
                request.reviewed_by_info = reviewed_by.user_info
        
        return request
    
    @community_change_request_ns.doc(description='Approve/reject change request',        
    responses={
                int(HTTPStatus.OK): "Request updated.", 
                int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/change_request/approve' required",
                int(HTTPStatus.NOT_FOUND): "Request not found."
                },
    security='CSRF')
    @community_change_request_ns.expect(update_change_request_parser)
    @auth_validator()
    def put(self, community_id, request_id):
        '''
        Update a change request for community, available to sysadmins

        Permissions: scope '/seta/community/change_request/approve' or "Administrator" role
        '''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        user = self.usersBroker.get_user_by_id(auth_id)

        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
            
        hasApproveRight = user.role.lower() == UserRoleConstants.Admin.lower() or user.has_system_scope(SystemScopeConstants.ApproveCommunityChangeRequest)        
        if not hasApproveRight:
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        request = None
        request_dict = update_change_request_parser.parse_args()
        status = request_dict["status"]
        
        try:  
            request = self.changeRequestsBroker.get_request(community_id=community_id, request_id=request_id)
            
            if request is not None:              
                request.status = status
                request.reviewed_by = auth_id
                
                self.changeRequestsBroker.update(request)                
        except:
            app.logger.exception("Request->put")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)   
           
        if request is None:
            abort(HTTPStatus.NOT_FOUND)
        
        message = f"Request {status}."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK
        
        return response