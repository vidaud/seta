from http import HTTPStatus
from injector import inject

from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, abort

from seta_flask_server.repository.models import CommunityInviteModel
from seta_flask_server.repository import interfaces

from seta_flask_server.infrastructure.scope_constants import CommunityScopeConstants
from seta_flask_server.infrastructure.constants import InviteStatusConstants

from .models import invite_dto as dto

community_invite_ns = Namespace(
    "Community Invites", validate=True, description="SETA Community Invites"
)
community_invite_ns.models.update(dto.ns_models)


@community_invite_ns.route(
    "/<string:community_id>/invites",
    endpoint="community_create_invite",
    methods=["POST", "GET"],
)
@community_invite_ns.param("community_id", "Community identifier")
class CommunityCreateInvites(Resource):
    """Handles HTTP POST requests to URL: /communities/{community_id}/invites."""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        invites_broker: interfaces.ICommunityInvitesBroker,
        communities_broker: interfaces.ICommunitiesBroker,
        *args,
        api=None,
        **kwargs
    ):
        self.users_broker = users_broker
        self.invites_broker = invites_broker
        self.communities_broker = communities_broker

        super().__init__(api, *args, **kwargs)

    @community_invite_ns.doc(
        description="Retrieve pending invites for this community.",
        responses={
            int(HTTPStatus.OK): "'Retrieved pending invites.",
            int(HTTPStatus.NOT_FOUND): "Community not found",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, scope 'community/invite' required",
        },
        security="CSRF",
    )
    @community_invite_ns.marshal_list_with(dto.invite_model, mask="*")
    @jwt_required()
    def get(self, community_id):
        """
        Retrieve pending invites sent by any community manager, available to community managers

        Permission scopes: any of "/seta/community/invite", "/seta/community/manager", "/seta/community/owner"
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not user.has_any_community_scope(
            community_id=community_id,
            scopes=[
                CommunityScopeConstants.SendInvite,
                CommunityScopeConstants.Manager,
                CommunityScopeConstants.Owner,
            ],
        ):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not self.communities_broker.community_id_exists(community_id):
            abort(HTTPStatus.NOT_FOUND)

        invites = self.invites_broker.get_all_by_status_and_community_id(
            community_id=community_id, status=InviteStatusConstants.Pending
        )

        for invite in invites:
            initiator = self.users_broker.get_user_by_id(
                user_id=invite.initiated_by, load_scopes=False
            )
            if initiator:
                invite.initiated_by_info = initiator.user_info

            invited = self.users_broker.get_user_by_id(
                user_id=invite.invited_user, load_scopes=False
            )
            if invited:
                invite.invited_user_info = invited.user_info

        return invites

    @community_invite_ns.doc(
        description="Create new invites.",
        responses={
            int(HTTPStatus.CREATED): "Added invites.",
            int(HTTPStatus.NOT_FOUND): "Community not found",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
        },
        security="CSRF",
    )
    @community_invite_ns.expect(dto.new_invite_parser)
    @jwt_required()
    def post(self, community_id):
        """
        Create invites, available to community managers.

        Permission scope: "/seta/community/invite"
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if not user.has_community_scope(
            community_id=community_id, scope=CommunityScopeConstants.SendInvite
        ):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not self.communities_broker.community_id_exists(community_id):
            abort(HTTPStatus.NOT_FOUND)

        request_dict = dto.new_invite_parser.parse_args()
        emails = request_dict["email"]
        message = request_dict["message"]

        count_sent = 0
        for email in emails:
            user = self.users_broker.get_user_by_email(email)
            if user is not None:
                invite = CommunityInviteModel(
                    community_id=community_id,
                    invited_user=user.user_id,
                    message=message,
                    initiated_by=auth_id,
                    status=InviteStatusConstants.Pending,
                )
                if self.invites_broker.create(invite):
                    count_sent += 1

        if count_sent > 0:
            response = jsonify(
                status="success", count_sent=count_sent, message="New invites added"
            )
        else:
            response = jsonify(
                status="success",
                count_sent=count_sent,
                message="No invite added: email not registered, membership or a pending invite already exists",
            )

        response.status_code = HTTPStatus.CREATED

        return response
