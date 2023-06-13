from flask import current_app as app, jsonify
from flask_jwt_extended import get_jwt_identity

from flask_restx import Namespace, Resource, abort

from injector import inject

from seta_flask_server.repository.interfaces import IMembershipsBroker, IUsersBroker, IUserPermissionsBroker
from seta_flask_server.infrastructure.decorators import auth_validator
from .models.membership_dto import (membership_model, user_info_model)
from seta_flask_server.infrastructure.scope_constants import CommunityScopeConstants

from .models.membership_dto import (request_model, user_info_model)

from http import HTTPStatus

my_membership_ns = Namespace('Community My Membership', validate=True, description='SETA Community My Membership')
my_membership_ns.models[user_info_model.name] = user_info_model
my_membership_ns.models[membership_model.name] = membership_model
my_membership_ns.models[request_model.name] = request_model

@my_membership_ns.route('/<string:community_id>/membership', endpoint="my_membership", methods=['GET', 'DELETE'])
@my_membership_ns.param("community_id", "Community identifier")
class MyMembership(Resource):
    """Handles my membership"""

    @inject
    def __init__(self, usersBroker: IUsersBroker, 
                 membershipsBroker: IMembershipsBroker, 
                 permissionsBroker: IUserPermissionsBroker, 
                 api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.membershipsBroker = membershipsBroker
        self.permissionsBroker = permissionsBroker
        
        super().__init__(api, *args, **kwargs)
        
    @my_membership_ns.doc(description='Retrieve user membership',        
        responses={int(HTTPStatus.OK): "Retrieved membership.",
                int(HTTPStatus.NOT_FOUND): "Membership not found."
                },
        security='CSRF')
    @my_membership_ns.marshal_with(membership_model, mask="*")
    @auth_validator()
    def get(self, community_id):
        '''Retrieve membership, available to any community member'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        membership = self.membershipsBroker.get_membership(community_id, auth_id)
        
        if membership is None:
            abort(HTTPStatus.NOT_FOUND)

        membership.user_info = user.user_info
        
        return membership
    
    @my_membership_ns.doc(description='Remove my membership',        
    responses={
                int(HTTPStatus.OK): "Membership removed.",
                int(HTTPStatus.NOT_FOUND): "Membership not found."
                },
    security='CSRF')
    @auth_validator()
    def delete(self, community_id):
        '''Remove my membership, available to any community member'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        #verify scope
        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        if not self.membershipsBroker.membership_exists(community_id, auth_id):
            abort(HTTPStatus.NOT_FOUND)
                    
        try:                
            self.membershipsBroker.delete_membership(community_id = community_id, user_id = auth_id)
        except:
            app.logger.exception("Membership->delete")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)   
            
        message = "Membership deleted."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK
        
        return response


@my_membership_ns.route('/membership-requests', endpoint="my_membership_requests", methods=['GET'])
class MyMembershipRequests(Resource):
    """Handles my membership requests"""

    @inject
    def __init__(self, usersBroker: IUsersBroker, 
                 membershipsBroker: IMembershipsBroker,
                 api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.membershipsBroker = membershipsBroker
        
        super().__init__(api, *args, **kwargs)

    @my_membership_ns.doc(description='Retrieve my membership requests.',
        responses={int(HTTPStatus.OK): "'Retrieved request list."},
        security='CSRF')
    @my_membership_ns.marshal_list_with(request_model, mask="*", skip_none = True)
    @auth_validator()    
    def get(self):
        '''Retrieve my membership requests, available to any user'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        requests = self.membershipsBroker.get_requests_by_user_id(auth_id)

        for request in requests:
            request.requested_by_info = user.user_info

            if request.reviewed_by:
                reviewed_by = self.usersBroker.get_user_by_id(request.reviewed_by, load_scopes=False)
                if reviewed_by:
                    request.reviewed_by_info = reviewed_by.user_info

        return requests