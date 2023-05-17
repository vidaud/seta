from flask import current_app as app, jsonify
from flask_jwt_extended import get_jwt_identity

from flask_restx import Namespace, Resource, abort

from injector import inject
from http import HTTPStatus

from seta_flask_server.repository.models import CommunityInviteModel
from seta_flask_server.repository.interfaces import ICommunityInvitesBroker, IUsersBroker, ICommunitiesBroker
from seta_flask_server.infrastructure.decorators import auth_validator
from seta_flask_server.infrastructure.scope_constants import CommunityScopeConstants
from seta_flask_server.infrastructure.constants import InviteStatusConstants

from .models.invite_dto import (new_invite_parser, invite_model)

community_invite_ns = Namespace('Community Invites', validate=True, description='SETA Community Invites')
community_invite_ns.models[invite_model.name] = invite_model

@community_invite_ns.route('/<string:community_id>/invites', endpoint="community_create_invite", methods=['POST', 'GET'])
@community_invite_ns.param("community_id", "Community identifier") 
class CommunityCreateChangeRequest(Resource):
    """Handles HTTP POST requests to URL: /communities/{community_id}/invites."""
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, invitesBroker: ICommunityInvitesBroker, communitiesBroker: ICommunitiesBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.invitesBroker = invitesBroker
        self.communitiesBroker = communitiesBroker
        
        super().__init__(api, *args, **kwargs)
        
    @community_invite_ns.doc(description='Retrieve pending invites for this community.',
        responses={int(HTTPStatus.OK): "'Retrieved pending invites.",
                   int(HTTPStatus.NOT_FOUND): "Community not found",
                   int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/invite' required"},
        security='CSRF')
    @community_invite_ns.marshal_list_with(invite_model, mask="*")
    @auth_validator()    
    def get(self, community_id):
        '''Retrieve pending invites'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if not user.has_any_community_scope(id=community_id,scopes=[CommunityScopeConstants.SendInvite, CommunityScopeConstants.Manager]):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
            
        if not self.communitiesBroker.community_id_exists(community_id):
            abort(HTTPStatus.NOT_FOUND)
        
        return self.invitesBroker.get_all_by_status_and_community_id(community_id=community_id, status=InviteStatusConstants.Pending)
        
    @community_invite_ns.doc(description='Create new invites.',        
        responses={int(HTTPStatus.CREATED): "Added invites.", 
                   int(HTTPStatus.NOT_FOUND): "Community not found",
                   int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/invite' required"},
        security='CSRF')
    @community_invite_ns.expect(new_invite_parser)
    @auth_validator()
    def post(self, community_id):
        '''Create invites'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if not user.has_any_community_scope(id=community_id,scopes=[CommunityScopeConstants.SendInvite, CommunityScopeConstants.Manager]):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
            
        if not self.communitiesBroker.community_id_exists(community_id):
            abort(HTTPStatus.NOT_FOUND)
        
        request_dict = new_invite_parser.parse_args()
        emails = request_dict["email"]
        message = request_dict["message"]
        
        count_sent = 0
        for email in emails:
            user = self.usersBroker.get_user_by_email(email)
            if user is not None:
                invite = CommunityInviteModel(community_id=community_id, invited_user = user.user_id, 
                                              message = message, initiated_by = auth_id, status = InviteStatusConstants.Pending)
                if self.invitesBroker.create(invite):
                    count_sent += 1
                    
        if count_sent > 0:
            response = jsonify(status="success", count_sent=count_sent, message="New invites added")
        else:
            response = jsonify(status="success", count_sent=count_sent, message="No invite added: email not registered, membership or a pending invite already exists")
        
        response.status_code = HTTPStatus.CREATED
        
        return response
    
