from flask import current_app as app, json, jsonify
from flask_jwt_extended import get_jwt_identity

from flask_restx import Namespace, Resource, abort

from injector import inject
from http import HTTPStatus

from seta_flask_server.repository.models import ResourceChangeRequestModel, ResourceLimitsModel
from seta_flask_server.repository.interfaces import IResourceChangeRequestsBroker, IUsersBroker, IResourcesBroker
from seta_flask_server.infrastructure.decorators import auth_validator
from seta_flask_server.infrastructure.scope_constants import SystemScopeConstants, ResourceScopeConstants, CommunityScopeConstants
from seta_flask_server.infrastructure.constants import UserRoleConstants, ResourceRequestFieldConstants

from .models.resource_request_dto import(new_change_request_parser, update_change_request_parser, change_request_model, user_info_model)

resource_change_request_ns = Namespace('Resource Change Requests', validate=True, description='SETA Resource Change Requests')
resource_change_request_ns.models[user_info_model.name] = user_info_model
resource_change_request_ns.models[change_request_model.name] = change_request_model

@resource_change_request_ns.route('/change-requests/pending', methods=['GET', 'POST'])
class ResourceChangeRequestList(Resource):
    '''Get list of all pending change requests for resources'''
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, 
                 changeRequestsBroker: IResourceChangeRequestsBroker, 
                 api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.changeRequestsBroker = changeRequestsBroker
        
        super().__init__(api, *args, **kwargs)
        
    @resource_change_request_ns.doc(description='Retrieve all pending change requests for resources.',
        responses={
                    int(HTTPStatus.OK): "'Retrieved pending change requests.",
                    int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'resource/change_request/approve' required"
                },
        
        security='CSRF')
    @resource_change_request_ns.marshal_list_with(change_request_model, mask="*", skip_none=True)
    @auth_validator()
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

@resource_change_request_ns.route('/<string:resource_id>/change-requests', methods=['GET','POST'])
@resource_change_request_ns.param("resource_id", "Resource identifier") 
class ResourceCreateChangeRequest(Resource):
    """Handles HTTP POST requests to URL: /resources/{resource_id}/change-requests."""
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, 
                 changeRequestsBroker: IResourceChangeRequestsBroker, 
                 resourcesBroker: IResourcesBroker, 
                 api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.changeRequestsBroker = changeRequestsBroker
        self.resourcesBroker = resourcesBroker
        
        super().__init__(api, *args, **kwargs)
        
    @resource_change_request_ns.doc(description='Add new change request for a resource field.',        
        responses={int(HTTPStatus.CREATED): "Added new change request.", 
                   int(HTTPStatus.CONFLICT): "Resource has already a pending change request for this field",
                   int(HTTPStatus.FORBIDDEN): "Insufficient rights",
                   int(HTTPStatus.BAD_REQUEST): "Filed name or input values are wrong"},
        security='CSRF')
    @resource_change_request_ns.expect(new_change_request_parser)
    @auth_validator()
    def post(self, resource_id):
        '''
        Create change request for a resource, available to resource editors
        Permission scope: "/seta/resource/edit"
        '''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not user.has_resource_scope(id=resource_id, scope = ResourceScopeConstants.Edit):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        request_dict = new_change_request_parser.parse_args()
        
        field_name = request_dict["field_name"]
        if self.changeRequestsBroker.has_pending_field(resource_id=resource_id, field_name=field_name):
            abort(HTTPStatus.CONFLICT, "Resource has already a pending change request for this field")

        #validate field values
        new_value = request_dict["new_value"]
        old_value = request_dict["old_value"]

        match field_name:
            case ResourceRequestFieldConstants.Limits:
                try:
                    ResourceLimitsModel.from_db_json(json.loads(new_value))
                except:
                    app.logger.exception(new_value)
                    abort(HTTPStatus.BAD_REQUEST, f"New value is not well formatted for limits type, for example {ResourceLimitsModel().to_json()}")

                try:
                    ResourceLimitsModel.from_db_json(json.loads(old_value))
                except:
                    app.logger.exception(old_value)
                    abort(HTTPStatus.BAD_REQUEST, f"old value is not well formatted for limits type, for example {ResourceLimitsModel().to_json()}")

        
        model = ResourceChangeRequestModel(resource_id = resource_id, field_name = field_name,
                                            new_value = new_value, old_value = old_value,
                                            requested_by = auth_id)
        try:
            self.changeRequestsBroker.create(model)
        except:
            app.logger.exception("ResourceCreateChangeRequest->post")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)
                
        response = jsonify(status="success", message="New change request added")
        response.status_code = HTTPStatus.CREATED
        
        return response
    
    @resource_change_request_ns.doc(description='Retrieve all change requests for a resource',
    responses={int(HTTPStatus.OK): "'Retrieved change requests.",
               int(HTTPStatus.NOT_FOUND): "Request not found.",
               int(HTTPStatus.FORBIDDEN): "Insufficient rights"
               },
    security='CSRF')
    @resource_change_request_ns.marshal_list_with(change_request_model, mask="*", skip_none=True)
    @auth_validator()    
    def get(self, resource_id):
        '''
        Retrieve all change requests for a resource, available to community managers and resource editors

        Permission scopes: any of "/seta/community/owner", "/seta/community/manager" or "/seta/resource/edit"
        '''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        resource = self.resourcesBroker.get_by_id(resource_id)
        if resource is None:
            abort(HTTPStatus.NOT_FOUND, "Resource not found")
            
        if (not user.has_any_community_scope(id = resource.community_id, scopes=[CommunityScopeConstants.Manager, CommunityScopeConstants.Owner])
                and not user.has_resource_scope(ResourceScopeConstants.Edit)):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        requests = self.changeRequestsBroker.get_all_by_resource_id(resource_id=resource_id)        

        for request in requests:
            requested_by = self.usersBroker.get_user_by_id(request.requested_by, load_scopes=False)
            if requested_by:
                request.requested_by_info = requested_by.user_info

            if request.reviewed_by:
                reviewed_by = self.usersBroker.get_user_by_id(request.reviewed_by, load_scopes=False)
                if reviewed_by:
                    request.reviewed_by_info = reviewed_by.user_info

        return requests
        

@resource_change_request_ns.route('/<string:resource_id>/change-requests/<string:request_id>', methods=['GET', 'PUT'])
@resource_change_request_ns.param("resource_id", "Resource identifier") 
@resource_change_request_ns.param("request_id", "Change request identifier")
class ResourceChangeRequest(Resource):
    """Handles HTTP requests to URL: /resources/{resource_id}/change-requests/{request_id}."""
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, changeRequestsBroker: IResourceChangeRequestsBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.changeRequestsBroker = changeRequestsBroker
        
        super().__init__(api, *args, **kwargs)
        
    @resource_change_request_ns.doc(description='Retrieve a change request for the resource.',
    responses={int(HTTPStatus.OK): "'Retrieved change request.",
               int(HTTPStatus.NOT_FOUND): "Request not found.",
               int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'resource/change_request/approve' required"
               },
    security='CSRF')
    @resource_change_request_ns.marshal_with(change_request_model, mask="*")
    @auth_validator()    
    def get(self, resource_id, request_id):
        '''
        Retrieve resource request, available to syadmins and initiator

        Permissions: scope '/seta/resource/change_request/approve' or "Administrator" role or requested_by == authenticated_id
        '''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        request = self.changeRequestsBroker.get_request(resource_id=resource_id, request_id=request_id)
        
        if request is None:
            abort(HTTPStatus.NOT_FOUND)

        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        #if not the initiator of the request, verify ApproveChangeRequest scope
        if request.requested_by != auth_id:            
            hasApproveRight = (user.role.lower() == UserRoleConstants.Admin.lower() or 
                user.has_system_scope(SystemScopeConstants.ApproveResourceChangeRequest))
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
    
    @resource_change_request_ns.doc(description='Approve/reject request',        
    responses={
                int(HTTPStatus.OK): "Request updated.", 
                int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'resource/change_request/approve' required",
                int(HTTPStatus.NOT_FOUND): "Request not found."
                },
    security='CSRF')
    @resource_change_request_ns.expect(update_change_request_parser)
    @auth_validator()
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

