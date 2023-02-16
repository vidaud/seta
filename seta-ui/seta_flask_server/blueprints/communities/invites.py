from flask import current_app as app, jsonify
from flask_jwt_extended import get_jwt_identity

from flask_restx import Namespace, Resource, abort

from injector import inject
from http import HTTPStatus

from seta_flask_server.repository.interfaces import ICommunityInvitesBroker, IUsersBroker
from seta_flask_server.infrastructure.decorators import auth_validator
from seta_flask_server.infrastructure.constants import InviteStatusConstants

from .models.invite_dto import (update_invite_parser, invite_model)

invite_ns = Namespace('Invites', validate=True, description='SETA Community Invites')
invite_ns.models[invite_model.name] = invite_model

@invite_ns.route('/invites/<string:invite_id>', endpoint="invite", methods=['GET', 'PUT'])
@invite_ns.param("invite_id", "Invite identifier")
class CommunityInvite(Resource):
    """Handles HTTP requests to URL: /invites/{invite_id}."""
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, invitesBroker: ICommunityInvitesBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.invitesBroker = invitesBroker
        
        super().__init__(api, *args, **kwargs)
        
    @invite_ns.doc(description='Retrieve invite.',
    responses={int(HTTPStatus.OK): "'Retrieved invite.",
               int(HTTPStatus.NOT_FOUND): "Invite not found.",
               int(HTTPStatus.FORBIDDEN): "Insufficient rights"
               },
    security='CSRF')
    @invite_ns.marshal_with(invite_model, mask="*")
    @auth_validator()    
    def get(self, invite_id):
        '''Retrieve invite'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        request = self.invitesBroker.get_by_invite_id(invite_id)
        
        if request is None:
            abort(HTTPStatus.NOT_FOUND, "Invite not found.")
        
        #if not the initiator of the request or the invitee, do not allow
        if request.initiated_by != auth_id and request.invited_user != auth_id:            
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        return request
    
    @invite_ns.doc(description='Accept/reject invite',        
    responses={
                int(HTTPStatus.OK): "Invite updated.", 
                int(HTTPStatus.FORBIDDEN): "Insufficient rights",
                int(HTTPStatus.NOT_FOUND): "Invite not found."
                },
    security='CSRF')
    @invite_ns.expect(update_invite_parser)
    @auth_validator()
    def put(self, invite_id):
        '''Update an invite'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        invite = self.invitesBroker.get_by_invite_id(invite_id)        
        
        #only pending invites can be updated
        if invite is None or invite.status != InviteStatusConstants.Pending:
            abort(HTTPStatus.NOT_FOUND, "Invite not found or not in pending anymore.")
        
        #if not the initiator, do not allow
        if invite.invited_user != auth_id:            
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")        
                
        request_dict = update_invite_parser.parse_args()
        status = request_dict["status"]
                     
        invite.status = status        
        self.invitesBroker.update(invite)                
                 
        message = f"Invite {status}."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK
        
        return response    