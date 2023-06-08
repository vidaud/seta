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

@invite_ns.route('/<string:invite_id>', endpoint="invite", methods=['GET', 'PUT'])
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
        '''Retrieve invite, available to initiator and invitee'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        invite = self.invitesBroker.get_by_invite_id(invite_id)
        
        if invite is None:
            abort(HTTPStatus.NOT_FOUND)
        
        #if not the initiator of the request or the invitee, do not allow
        if invite.initiated_by != auth_id and invite.invited_user != auth_id:            
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        initiator = self.usersBroker.get_user_by_id(user_id=invite.initiated_by, load_scopes=False)
        if initiator:
            invite.initiated_by_info = initiator.user_info

        invited = self.usersBroker.get_user_by_id(user_id=invite.invited_user, load_scopes=False)
        if invited:
            invite.invited_user_info = invited.user_info
        
        return invite
    
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
        '''Update an invite, available to invitee'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        invite = self.invitesBroker.get_by_invite_id(invite_id)        
        
        #only pending invites can be updated
        if invite is None or invite.status != InviteStatusConstants.Pending:
            abort(HTTPStatus.NOT_FOUND)
        
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
    
@invite_ns.route('/', endpoint="my_invites", methods=['GET', 'PUT'])
class MyCommunityInvites(Resource):
    """Handles HTTP requests to URL: /invites"""
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, invitesBroker: ICommunityInvitesBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.invitesBroker = invitesBroker
        
        super().__init__(api, *args, **kwargs)
        
    @invite_ns.doc(description='Retrieve my pending invites.',
    responses={int(HTTPStatus.OK): "'Retrieved invites." },
    security='CSRF')
    @invite_ns.marshal_list_with(invite_model, mask="*")
    @auth_validator()    
    def get(self):
        '''Retrieve my pending invites, available to any user'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        invites = self.invitesBroker.get_all_by_status_and_invited_user_id(user_id = auth_id, status=InviteStatusConstants.Pending)
        
        for invite in invites:
            initiator = self.usersBroker.get_user_by_id(user_id=invite.initiated_by, load_scopes=False)
            if initiator:
                invite.initiated_by_info = initiator.user_info

            invited = self.usersBroker.get_user_by_id(user_id=invite.invited_user, load_scopes=False)
            if invited:
                invite.invited_user_info = invited.user_info

        return invites