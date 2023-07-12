from flask import current_app as app, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from flask_restx import Namespace, Resource, abort

from injector import inject
from http import HTTPStatus

from seta_flask_server.repository.interfaces import ICommunityChangeRequestsBroker, IUsersBroker, IResourceChangeRequestsBroker

from seta_flask_server.infrastructure.scope_constants import SystemScopeConstants
from seta_flask_server.infrastructure.constants import UserRoleConstants

from .models.change_request_dto import user_info_model, community_change_request_model, resource_change_request_model, update_change_request_parser

change_requests_ns = Namespace('Community Change Requests', validate=True, description='SETA Community Change Requests')
change_requests_ns.models[user_info_model.name] = user_info_model
change_requests_ns.models[community_change_request_model.name] = community_change_request_model
change_requests_ns.models[resource_change_request_model.name] = resource_change_request_model

@change_requests_ns.route('/communities/change-requests', endpoint="community_change_request_list", methods=['GET'])
class CommunityChangeRequestList(Resource):
    """Handles HTTP requests to URL: /admin/communities/change-requests."""
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, changeRequestsBroker: ICommunityChangeRequestsBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.changeRequestsBroker = changeRequestsBroker
        
        super().__init__(api, *args, **kwargs)
        
    @change_requests_ns.doc(description='Retrieve all pending change requests issued for communities',
        responses={
                    int(HTTPStatus.OK): "'Retrieved pending change requests.",
                    int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/change_request/approve' required"
                },
        
        security='CSRF')
    @change_requests_ns.marshal_list_with(community_change_request_model, mask="*")
    @jwt_required()
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
    
       
@change_requests_ns.route('/communities/<string:community_id>/change-requests/<string:request_id>', endpoint="community_change_request", methods=['PUT'])
@change_requests_ns.param("community_id", "Community identifier") 
@change_requests_ns.param("request_id", "Change request identifier")
class CommunityChangeRequest(Resource):
    """Handles HTTP requests to URL: /admin/communities/{community_id}/change-requests/{request_id}."""

    @inject
    def __init__(self, usersBroker: IUsersBroker, changeRequestsBroker: ICommunityChangeRequestsBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.changeRequestsBroker = changeRequestsBroker
        
        super().__init__(api, *args, **kwargs)

    @change_requests_ns.doc(description='Approve/reject change request',        
    responses={
                int(HTTPStatus.OK): "Request updated.", 
                int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/change_request/approve' required",
                int(HTTPStatus.NOT_FOUND): "Request not found."
                },
    security='CSRF')
    @change_requests_ns.expect(update_change_request_parser)
    @jwt_required()
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
    
@change_requests_ns.route('/resources/change-requests', methods=['GET'])
class ResourceChangeRequestList(Resource):
    """Handles HTTP requests to URL: /admin/resources/change-requests."""
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, 
                 changeRequestsBroker: IResourceChangeRequestsBroker, 
                 api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.changeRequestsBroker = changeRequestsBroker
        
        super().__init__(api, *args, **kwargs)
        
    @change_requests_ns.doc(description='Retrieve all pending change requests for resources.',
        responses={
                    int(HTTPStatus.OK): "'Retrieved pending change requests.",
                    int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'resource/change_request/approve' required"
                },
        
        security='CSRF')
    @change_requests_ns.marshal_list_with(resource_change_request_model, mask="*", skip_none=True)
    @jwt_required()
    def get(self):
        '''
        Retrieve all pending change requests for resources, available to sysadmins

        Permissions: either scope "/seta/resource/change_request/approve" or "Administrator" role
        '''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        #verify scope
        user = self.usersBroker.get_user_by_id(auth_id)        
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        hasApproveRight = user.role.lower() == UserRoleConstants.Admin.lower() or user.has_system_scope(SystemScopeConstants.ApproveResourceChangeRequest)        
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
    
@change_requests_ns.route('/resources/<string:resource_id>/change-requests/<string:request_id>', methods=['PUT'])
@change_requests_ns.param("resource_id", "Resource identifier") 
@change_requests_ns.param("request_id", "Change request identifier")
class ResourceChangeRequest(Resource):
    """Handles HTTP requests to URL: /admin/resources/{resource_id}/change-requests/{request_id}."""
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, changeRequestsBroker: IResourceChangeRequestsBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.changeRequestsBroker = changeRequestsBroker
        
        super().__init__(api, *args, **kwargs)

    @change_requests_ns.doc(description='Approve/reject request',        
    responses={
                int(HTTPStatus.OK): "Request updated.", 
                int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'resource/change_request/approve' required",
                int(HTTPStatus.NOT_FOUND): "Request not found."
                },
    security='CSRF')
    @change_requests_ns.expect(update_change_request_parser)
    @jwt_required()
    def put(self, resource_id, request_id):
        '''
        Update a change request for resource, available to sysadmins

        Permissions: scope '/seta/resource/change_request/approve' or "Administrator" role
        '''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        user = self.usersBroker.get_user_by_id(auth_id)

        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        hasApproveRight = user.role.lower() == UserRoleConstants.Admin.lower() or user.has_system_scope(SystemScopeConstants.ApproveResourceChangeRequest)
        if not hasApproveRight:
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        request = None
        request_dict = update_change_request_parser.parse_args()
        status = request_dict["status"]
        
        try:  
            request = self.changeRequestsBroker.get_request(resource_id=resource_id, request_id=request_id)
            
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