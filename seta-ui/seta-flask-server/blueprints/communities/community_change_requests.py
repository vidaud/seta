from flask import current_app as app, jsonify
from flask_jwt_extended import get_jwt_identity

from flask_restx import Namespace, Resource, abort

from injector import inject
from http import HTTPStatus

from repository.models import CommunityChangeRequestModel
from repository.interfaces import ICommunityChangeRequestsBroker, IUsersBroker
from infrastructure.decorators import auth_validator
from infrastructure.scope_constants import CommunityScopeConstants
from infrastructure.constants import RequestStatusConstants

from .models.community_dto import(new_change_request_parser, update_change_request_parser, change_request_model)

community_change_request_ns = Namespace('Community Change Requests', validate=True, description='SETA Community Change Requests')
community_change_request_ns.models[change_request_model.name] = change_request_model

@community_change_request_ns.route('/change_requests/pending', endpoint="community_change_request_list", methods=['GET', 'POST'])
class CommunityChangeRequestList(Resource):
    '''Get a list of pending community change requests and expose POST for new requests'''
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, changeRequestsBroker: ICommunityChangeRequestsBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.changeRequestsBroker = changeRequestsBroker
        
        super().__init__(api, *args, **kwargs)
        
    @community_change_request_ns.doc(description='Retrieve pending change requests for communitites.',
        responses={
                    int(HTTPStatus.OK): "'Retrieved pending change requests.",
                    int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/change_request/approve' required"
                },
        
        security='CSRF')
    @community_change_request_ns.marshal_list_with(change_request_model, mask="*")
    @auth_validator()
    def get(self):
        '''Retrieve pending change requests'''
        
        identity = get_jwt_identity()
        user_id = identity["user_id"]
        
        #verify scope
        user = self.usersBroker.get_user_by_id(user_id)        
        if user is None:
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if not user.has_system_scope(CommunityScopeConstants.ApproveChangeRequest):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        return self.changeRequestsBroker.get_all_pending()
    
@community_change_request_ns.route('/<string:community_id>/change-requests', endpoint="community_create_change_request", methods=['POST'])
@community_change_request_ns.param("community_id", "Community identifier") 
class CommunityCreateChangeRequest(Resource):
    """Handles HTTP POST requests to URL: /communities/{community_id}/change-requests."""
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, changeRequestsBroker: ICommunityChangeRequestsBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.changeRequestsBroker = changeRequestsBroker
        
        super().__init__(api, *args, **kwargs)
        
    @community_change_request_ns.doc(description='Add new change request for a community field.',        
        responses={int(HTTPStatus.CREATED): "Added new change request.", 
                   int(HTTPStatus.CONFLICT): "Community has already a pending change request for this field",
                   int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/edit' required",},
        security='CSRF')
    @community_change_request_ns.expect(new_change_request_parser)
    @auth_validator()
    def post(self, community_id):
        '''Create a community change request'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None:
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if not user.has_community_scope(id=community_id, scope=CommunityScopeConstants.Edit):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        request_dict = new_change_request_parser.parse_args()
        
        if self.changeRequestsBroker.has_pending_field(community_id=community_id, filed_name=request_dict["field_name"]):
            abort(HTTPStatus.CONFLICT, "Community has already a pending change request for this field")
        
        model = CommunityChangeRequestModel(community_id = community_id, field_name=request_dict["field_name"],
                                            new_value=request_dict["new_value"], old_value=request_dict["old_value"],
                                            status = RequestStatusConstants.Pending, requested_by = auth_id)
        try:
            self.changeRequestsBroker.create(model)
        except:
            app.logger.exception("CreateChangeRequest->post")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)
                
        response = jsonify(status="success", message="New change request added")
        response.status_code = HTTPStatus.CREATED
        
        return response
   
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
        
    @community_change_request_ns.doc(description='Retrieve change request for the community.',
    responses={int(HTTPStatus.OK): "'Retrieved change request.",
               int(HTTPStatus.NOT_FOUND): "Request not found.",
               int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/change_request/approve' required"
               },
    security='CSRF')
    @community_change_request_ns.marshal_with(change_request_model, mask="*")
    @auth_validator()    
    def get(self, community_id, request_id):
        '''Retrieve user request'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        request = self.changeRequestsBroker.get_request(community_id=community_id, request_id=request_id)
        
        if request is None:
            abort(HTTPStatus.NOT_FOUND, "Request not found.")
        
        #if not the initiator of the request, verify ApproveChangeRequest scope
        if request.requested_by != auth_id:            
            user = self.usersBroker.get_user_by_id(auth_id)
            if user is None:
                abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
            if not user.has_system_scope(scope=CommunityScopeConstants.ApproveChangeRequest):
                abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        return request
    
    @community_change_request_ns.doc(description='Approve/reject request',        
    responses={
                int(HTTPStatus.OK): "Request updated.", 
                int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/membership/approve' required",
                int(HTTPStatus.NOT_FOUND): "Request not found."
                },
    security='CSRF')
    @community_change_request_ns.expect(update_change_request_parser)
    @auth_validator()
    def put(self, community_id, request_id):
        '''Update a request'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        user = self.usersBroker.get_user_by_id(auth_id)

        if user is None:
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if not user.has_system_scope(scope=CommunityScopeConstants.ApproveChangeRequest):
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
            abort(HTTPStatus.NOT_FOUND, "Request not found.")
        
        message = f"Request {status}."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK
        
        return response