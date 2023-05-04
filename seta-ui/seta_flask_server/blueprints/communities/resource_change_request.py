from flask import current_app as app, jsonify
from flask_jwt_extended import get_jwt_identity

from flask_restx import Namespace, Resource, abort

from injector import inject
from http import HTTPStatus

from seta_flask_server.repository.models import ResourceChangeRequestModel
from seta_flask_server.repository.interfaces import IResourceChangeRequestsBroker, IUsersBroker
from seta_flask_server.infrastructure.decorators import auth_validator
from seta_flask_server.infrastructure.scope_constants import SystemScopeConstants, ResourceScopeConstants

from .models.resource_request_dto import(new_change_request_parser, update_change_request_parser, change_request_model)

resource_change_request_ns = Namespace('Resource Change Requests', validate=True, description='SETA Resource Change Requests')
resource_change_request_ns.models[change_request_model.name] = change_request_model

@resource_change_request_ns.route('/change-requests/pending', methods=['GET', 'POST'])
class ResourceChangeRequestList(Resource):
    '''Get a list of pending resource change requests'''
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, changeRequestsBroker: IResourceChangeRequestsBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.changeRequestsBroker = changeRequestsBroker
        
        super().__init__(api, *args, **kwargs)
        
    @resource_change_request_ns.doc(description='Retrieve pending change requests for resources.',
        responses={
                    int(HTTPStatus.OK): "'Retrieved pending change requests.",
                    int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'resource/change_request/approve' required"
                },
        
        security='CSRF')
    @resource_change_request_ns.marshal_list_with(change_request_model, mask="*")
    @auth_validator()
    def get(self):
        '''Retrieve pending change requests'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        #verify scope
        user = self.usersBroker.get_user_by_id(auth_id)        
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if not user.has_system_scope(SystemScopeConstants.ApproveResourceChangeRequest):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        return self.changeRequestsBroker.get_all_pending()

@resource_change_request_ns.route('/<string:resource_id>/change-requests', methods=['POST'])
@resource_change_request_ns.param("resource_id", "Resource identifier") 
class ResourceCreateChangeRequest(Resource):
    """Handles HTTP POST requests to URL: /resources/{resource_id}/change-requests."""
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, changeRequestsBroker: IResourceChangeRequestsBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.changeRequestsBroker = changeRequestsBroker
        
        super().__init__(api, *args, **kwargs)
        
    @resource_change_request_ns.doc(description='Add new change request for a resource field.',        
        responses={int(HTTPStatus.CREATED): "Added new change request.", 
                   int(HTTPStatus.CONFLICT): "Resource has already a pending change request for this field",
                   int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'resource/edit' required",},
        security='CSRF')
    @resource_change_request_ns.expect(new_change_request_parser)
    @auth_validator()
    def post(self, resource_id):
        '''Create a resource change request'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if not user.has_resource_scope(id=resource_id, scope=ResourceScopeConstants.Edit):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        request_dict = new_change_request_parser.parse_args()
        
        if self.changeRequestsBroker.has_pending_field(resource_id=resource_id, filed_name=request_dict["field_name"]):
            abort(HTTPStatus.CONFLICT, "Resource has already a pending change request for this field")
        
        model = ResourceChangeRequestModel(resource_id=resource_id, field_name=request_dict["field_name"],
                                            new_value=request_dict["new_value"], old_value=request_dict["old_value"],
                                            requested_by = auth_id)
        try:
            self.changeRequestsBroker.create(model)
        except:
            app.logger.exception("ResourceCreateChangeRequest->post")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)
                
        response = jsonify(status="success", message="New change request added")
        response.status_code = HTTPStatus.CREATED
        
        return response        

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
        
    @resource_change_request_ns.doc(description='Retrieve change request for the community.',
    responses={int(HTTPStatus.OK): "'Retrieved change request.",
               int(HTTPStatus.NOT_FOUND): "Request not found.",
               int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/change_request/approve' required"
               },
    security='CSRF')
    @resource_change_request_ns.marshal_with(change_request_model, mask="*")
    @auth_validator()    
    def get(self, resource_id, request_id):
        '''Retrieve resource request'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        request = self.changeRequestsBroker.get_request(resource_id=resource_id, request_id=request_id)
        
        if request is None:
            abort(HTTPStatus.NOT_FOUND)
        
        #if not the initiator of the request, verify ApproveChangeRequest scope
        if request.requested_by != auth_id:            
            user = self.usersBroker.get_user_by_id(auth_id)
            if user is None or user.is_not_active():
                abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
            if not user.has_system_scope(scope=SystemScopeConstants.ApproveResourceChangeRequest):
                abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        return request
    
    @resource_change_request_ns.doc(description='Approve/reject request',        
    responses={
                int(HTTPStatus.OK): "Request updated.", 
                int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/membership/approve' required",
                int(HTTPStatus.NOT_FOUND): "Request not found."
                },
    security='CSRF')
    @resource_change_request_ns.expect(update_change_request_parser)
    @auth_validator()
    def put(self, resource_id, request_id):
        '''Update a change request'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        user = self.usersBroker.get_user_by_id(auth_id)

        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if not user.has_system_scope(scope=SystemScopeConstants.ApproveResourceChangeRequest):
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

