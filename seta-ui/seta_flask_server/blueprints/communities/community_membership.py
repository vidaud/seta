from http import HTTPStatus
from injector import inject

from flask import current_app as app, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, abort


from seta_flask_server.repository.models import MembershipModel
from seta_flask_server.repository import interfaces

from seta_flask_server.infrastructure.scope_constants import CommunityScopeConstants
from seta_flask_server.infrastructure.constants import (
    CommunityMembershipConstants,
    CommunityRoleConstants,
)

from .models import membership_dto as dto

membership_ns = Namespace(
    "Community Memberships", validate=True, description="SETA Community Memberships"
)
membership_ns.models.update(dto.membership_ns_models)


@membership_ns.route(
    "/<string:community_id>/memberships",
    endpoint="memberships",
    methods=["GET", "POST"],
)
@membership_ns.param("community_id", "Community id")
class MembershipList(Resource):
    """Get a list of community memberships and expose POST for new member"""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        memberships_broker: interfaces.IMembershipsBroker,
        communities_broker: interfaces.ICommunitiesBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.memberships_broker = memberships_broker
        self.communities_broker = communities_broker

        super().__init__(api, *args, **kwargs)

    @membership_ns.doc(
        description="Retrieve membership list for this community.",
        responses={
            int(HTTPStatus.OK): "'Retrieved membership list.",
            int(HTTPStatus.NOT_FOUND): "Community not found",
        },
        security="CSRF",
    )
    @membership_ns.marshal_list_with(dto.membership_model, mask="*")
    @jwt_required()
    def get(self, community_id):
        """Retrieve community memberships, available to any member of this community"""

        if not self.communities_broker.community_id_exists(community_id):
            abort(HTTPStatus.NOT_FOUND)

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not self.memberships_broker.get_membership(
            community_id=community_id, user_id=auth_id
        ):
            abort(
                HTTPStatus.FORBIDDEN,
                "Insufficient rights. The user has to be part of this community",
            )

        memberships = self.memberships_broker.get_memberships_by_community_id(
            community_id
        )

        for membership in memberships:
            member = self.users_broker.get_user_by_id(
                membership.user_id, load_scopes=False
            )
            if member:
                membership.user_info = member.user_info

        return memberships

    @membership_ns.doc(
        description="Add new member to an opened community.",
        responses={
            int(HTTPStatus.CREATED): "Added new member.",
            int(HTTPStatus.FORBIDDEN): "Community is not opened",
            int(HTTPStatus.NOT_FOUND): "Community not found",
            int(HTTPStatus.CONFLICT): "Member already exists.",
        },
        security="CSRF",
    )
    @jwt_required()
    def post(self, community_id):
        """Create a member for an opened community, available to any user"""

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        community = self.communities_broker.get_by_id(community_id)
        if community is None:
            abort(HTTPStatus.NOT_FOUND)

        if community.membership != CommunityMembershipConstants.Opened:
            abort(
                HTTPStatus.FORBIDDEN,
                "Community is not opened, a membership request is required",
            )

        member_exists = False
        try:
            member_exists = self.memberships_broker.membership_exists(
                community_id, auth_id
            )

            if not member_exists:
                model = MembershipModel(
                    community_id=community_id,
                    user_id=auth_id,
                    role=CommunityRoleConstants.Member,
                )

                self.memberships_broker.create_membership(model=model)
        except Exception:
            app.logger.exception("MembershipList->post")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)

        if member_exists:
            abort(
                HTTPStatus.CONFLICT,
                "User is already part of this community.",
                status="fail",
            )

        response = jsonify(status="success", message="New member added")
        response.status_code = HTTPStatus.CREATED

        return response


@membership_ns.route(
    "/<string:community_id>/memberships/<string:user_id>",
    endpoint="manage_membership",
    methods=["GET", "PUT", "DELETE"],
)
@membership_ns.param("community_id", "Community identifier")
@membership_ns.param("user_id", "User identifier")
class MembershipManagement(Resource):
    """Handles membership management"""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        memberships_broker: interfaces.IMembershipsBroker,
        permissions_broker: interfaces.IUserPermissionsBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.memberships_broker = memberships_broker
        self.permissions_broker = permissions_broker

        super().__init__(api, *args, **kwargs)

    @membership_ns.doc(
        description="Retrieve user membership",
        responses={
            int(HTTPStatus.OK): "Retrieved membership.",
            int(HTTPStatus.NOT_FOUND): "Membership not found.",
        },
        security="CSRF",
    )
    @membership_ns.marshal_with(dto.membership_model, mask="*")
    @jwt_required()
    def get(self, community_id, user_id):
        """
        Retrieve membership, available to community managers

        Permission scopes: any of "/seta/community/owner", "/seta/community/manager"
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if auth_id != user_id and not user.has_any_community_scope(
            community_id=community_id,
            scopes=[CommunityScopeConstants.Manager, CommunityScopeConstants.Owner],
        ):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        membership = self.memberships_broker.get_membership(community_id, user_id)

        if membership is None:
            abort(HTTPStatus.NOT_FOUND)

        member = self.users_broker.get_user_by_id(membership.user_id, load_scopes=False)
        if member:
            membership.user_info = member.user_info

        return membership

    @membership_ns.doc(
        description="Update membership fields",
        responses={
            int(HTTPStatus.OK): "Membership updated.",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, scope 'community/manager' required",
            int(HTTPStatus.NOT_FOUND): "Membership not found.",
        },
        security="CSRF",
    )
    @membership_ns.expect(dto.update_membership_parser)
    @jwt_required()
    def put(self, community_id, user_id):
        """
        Update a community membership, available to community managers

        Permission scopes: any of "/seta/community/owner", "/seta/community/manager"
        Only an owner can edit the membership of another owner!
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        # verify scope
        user = self.users_broker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if not user.has_any_community_scope(
            community_id=community_id,
            scopes=[CommunityScopeConstants.Manager, CommunityScopeConstants.Owner],
        ):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not self.memberships_broker.membership_exists(community_id, user_id):
            abort(HTTPStatus.NOT_FOUND)

        membership_dict = dto.update_membership_parser.parse_args()

        try:
            # verify owner scope for the target user_id
            scopes = self.permissions_broker.get_user_community_scopes_by_id(
                user_id=user_id, community_id=community_id
            )
            if any(cs.scope == CommunityScopeConstants.Owner for cs in scopes):
                # only an owner can edit another owner (including himself)
                if not user.has_community_scope(
                    community_id=community_id, scope=CommunityScopeConstants.Owner
                ):
                    abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

            model = MembershipModel(
                community_id=community_id,
                user_id=user_id,
                role=membership_dict["role"],
                status=membership_dict["status"],
            )

            self.memberships_broker.update_membership(model)
        except Exception:
            app.logger.exception("Membership->put")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)

        message = "Membership updated."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK

        return response

    @membership_ns.doc(
        description="Remove membership",
        responses={
            int(HTTPStatus.OK): "Membership removed.",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, scope 'community/edit' required",
            int(HTTPStatus.NOT_FOUND): "Membership not found.",
            int(HTTPStatus.CONFLICT): "Cannot remove the only owner.",
        },
        security="CSRF",
    )
    @jwt_required()
    def delete(self, community_id, user_id):
        """
        Remove a membership, available to community managers.

        Permission scopes: any of "/seta/community/owner", "/seta/community/manager"
        Only an owner can remove the membership of another owner!
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        # verify scope
        user = self.users_broker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if not user.has_any_community_scope(
            community_id=community_id,
            scopes=[CommunityScopeConstants.Manager, CommunityScopeConstants.Owner],
        ):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not self.memberships_broker.membership_exists(community_id, user_id):
            abort(HTTPStatus.NOT_FOUND)

        # verify owner scope for the target user_id
        scopes = self.permissions_broker.get_user_community_scopes_by_id(
            user_id=user_id, community_id=community_id
        )
        if any(cs.scope == CommunityScopeConstants.Owner for cs in scopes):
            # only an owner can remove another owner (including himself)
            if not user.has_community_scope(
                community_id=community_id, scope=CommunityScopeConstants.Owner
            ):
                abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        try:
            self.memberships_broker.delete_membership(
                community_id=community_id, user_id=user_id
            )
        except Exception:
            app.logger.exception("Membership->delete")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)

        message = "Membership deleted."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK

        return response
