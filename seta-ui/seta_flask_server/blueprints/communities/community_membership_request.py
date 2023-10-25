from http import HTTPStatus
from injector import inject

from flask import current_app as app, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, abort


from seta_flask_server.repository.models import MembershipRequestModel, EntityScope
from seta_flask_server.repository import interfaces
from seta_flask_server.infrastructure.scope_constants import CommunityScopeConstants
from seta_flask_server.infrastructure.constants import RequestStatusConstants

from .models import membership_dto as dto

membership_request_ns = Namespace(
    "Community Membership Requests",
    validate=True,
    description="SETA Community Membership Requests",
)
membership_request_ns.models.update(dto.request_ns_models)


@membership_request_ns.route(
    "/<string:community_id>/requests", endpoint="requests", methods=["GET", "POST"]
)
@membership_request_ns.param("community_id", "Community identifier")
class MembershipRequestList(Resource):
    """Get a list of community requests and expose POST for new request"""

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

    @membership_request_ns.doc(
        description="Retrieve pending request list for this community.",
        responses={
            int(HTTPStatus.OK): "'Retrieved request list.",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
            int(HTTPStatus.NOT_FOUND): "Community not found",
        },
        security="CSRF",
    )
    @membership_request_ns.marshal_list_with(
        dto.request_model, mask="*", skip_none=True
    )
    @jwt_required()
    def get(self, community_id):
        """Retrieve pending community requests, available to community managers.

        Permission scopes: any of "/seta/community/owner",
                "/seta/community/manager" or "/seta/community/membership/approve"
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        scopes = [
            CommunityScopeConstants.Owner,
            CommunityScopeConstants.Manager,
            CommunityScopeConstants.ApproveMembershipRequest,
        ]
        if not user.has_any_community_scope(community_id=community_id, scopes=scopes):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not self.communities_broker.community_id_exists(community_id):
            abort(HTTPStatus.NOT_FOUND)

        requests = self.memberships_broker.get_requests_by_community_ids(
            community_ids=[community_id], status=RequestStatusConstants.Pending
        )

        for request in requests:
            requested_by = self.users_broker.get_user_by_id(
                request.requested_by, load_scopes=False
            )
            if requested_by:
                request.requested_by_info = requested_by.user_info

        return requests

    @membership_request_ns.doc(
        description="Add new request for the community for the authorized user.",
        responses={
            int(HTTPStatus.CREATED): "Added new request.",
            int(HTTPStatus.NOT_FOUND): "Community not found",
            int(HTTPStatus.CONFLICT): "Member or pending request already exists.",
        },
        security="CSRF",
    )
    @membership_request_ns.expect(dto.new_request_parser)
    @jwt_required()
    def post(self, community_id):
        """
        Create a community membership request, available to any user
        """

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        member_exists = False
        request_exists = False
        community_exists = False

        request_dict = dto.new_request_parser.parse_args()

        try:
            community_exists = self.communities_broker.community_id_exists(community_id)

            if community_exists:
                member_exists = self.memberships_broker.membership_exists(
                    community_id=community_id, user_id=user_id
                )

                if not member_exists:
                    model = MembershipRequestModel(
                        community_id=community_id,
                        requested_by=user_id,
                        message=request_dict["message"],
                    )

                    request_exists = not self.memberships_broker.create_request(model)
        except Exception:
            app.logger.exception("MembershipList->post")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)

        if not community_exists:
            abort(HTTPStatus.NOT_FOUND)

        if member_exists:
            error = "User is already part of this community."
            abort(HTTPStatus.CONFLICT, error, status="fail")

        if request_exists:
            error = "User has already sent a request to this community."
            abort(HTTPStatus.CONFLICT, error, status="fail")

        response = jsonify(status="success", message="New membership request added")
        response.status_code = HTTPStatus.CREATED

        return response


@membership_request_ns.route("/requests", endpoint="all-requests", methods=["GET"])
class MembershipAllRequests(Resource):
    """Get a list of pending requests for all managed communities"""

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

    @membership_request_ns.doc(
        description="Retrieve pending request list for managed communities.",
        responses={
            int(HTTPStatus.OK): "'Retrieved request list.",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
        },
        security="CSRF",
    )
    @membership_request_ns.marshal_list_with(
        dto.request_model, mask="*", skip_none=True
    )
    @jwt_required()
    def get(self):
        """Retrieve pending requests for all managed communities, available to community managers.

        Permission scopes: any of "/seta/community/owner",
                "/seta/community/manager" or "/seta/community/membership/approve"
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        scopes = [
            CommunityScopeConstants.Owner,
            CommunityScopeConstants.Manager,
            CommunityScopeConstants.ApproveMembershipRequest,
        ]

        # get all managed community ids:
        community_ids = []
        for community_scope in user.community_scopes:
            if any(s == community_scope.scope for s in scopes) and (
                not community_scope.id in community_ids
            ):
                community_ids.append(community_scope.id)

        if not community_ids:
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        requests = self.memberships_broker.get_requests_by_community_ids(
            community_ids=community_ids, status=RequestStatusConstants.Pending
        )

        for request in requests:
            requested_by = self.users_broker.get_user_by_id(
                request.requested_by, load_scopes=False
            )
            if requested_by:
                request.requested_by_info = requested_by.user_info

        return requests


@membership_request_ns.route(
    "/<string:community_id>/requests/<string:user_id>",
    endpoint="request",
    methods=["GET", "PUT"],
)
@membership_request_ns.param("community_id", "Community identifier")
@membership_request_ns.param("user_id", "Requested by identifier")
class MembershipRequest(Resource):
    """Handles HTTP requests to URL: /communities/{community_id}/requests/{user_id}."""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        memberships_broker: interfaces.IMembershipsBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.memberships_broker = memberships_broker

        super().__init__(api, *args, **kwargs)

    @membership_request_ns.doc(
        description="Retrieve a user request.",
        responses={
            int(HTTPStatus.OK): "'Retrieved user request.",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
            int(HTTPStatus.NOT_FOUND): "Request not found.",
        },
        security="CSRF",
    )
    @membership_request_ns.marshal_with(dto.request_model, mask="*", skip_none=True)
    @jwt_required()
    def get(self, community_id, user_id):
        """Retrieve a user request, available to community managers.

        Permission scopes: any of "/seta/community/owner",
                    "/seta/community/manager" or "/seta/community/membership/approve"
        """

        if not self.memberships_broker.request_exists(
            community_id=community_id, user_id=user_id
        ):
            abort(HTTPStatus.NOT_FOUND)

        # verify scope
        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        scopes = [
            CommunityScopeConstants.ApproveMembershipRequest,
            CommunityScopeConstants.Manager,
            CommunityScopeConstants.Owner,
        ]
        if not user.has_any_community_scope(community_id=community_id, scopes=scopes):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        request = self.memberships_broker.get_request(
            community_id=community_id, user_id=user_id
        )

        requested_by = self.users_broker.get_user_by_id(
            request.requested_by, load_scopes=False
        )
        if requested_by:
            request.requested_by_info = requested_by.user_info

        if request.reviewed_by:
            reviewed_by = self.users_broker.get_user_by_id(
                request.reviewed_by, load_scopes=False
            )
            if reviewed_by:
                request.reviewed_by_info = reviewed_by.user_info

        return request

    @membership_request_ns.doc(
        description="Approve/reject request",
        responses={
            int(HTTPStatus.OK): "Request updated.",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
            int(HTTPStatus.NOT_FOUND): "Request not found.",
            int(HTTPStatus.CONFLICT): "Request status already set",
        },
        security="CSRF",
    )
    @membership_request_ns.expect(dto.update_request_parser)
    @jwt_required()
    def put(self, community_id, user_id):
        """Approve/reject a membership request, available to community managers.

        Permission scopes: any of "/seta/community/owner",
                    "/seta/community/manager" or "/seta/community/membership/approve"
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        # verify scope
        user = self.users_broker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        scopes = [
            CommunityScopeConstants.ApproveMembershipRequest,
            CommunityScopeConstants.Manager,
            CommunityScopeConstants.Owner,
        ]
        if not user.has_any_community_scope(community_id=community_id, scopes=scopes):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not self.memberships_broker.request_exists(
            community_id=community_id, user_id=user_id
        ):
            abort(HTTPStatus.NOT_FOUND)

        request_dict = dto.update_request_parser.parse_args()
        status = request_dict["status"]

        request = self.memberships_broker.get_request(
            community_id=community_id, user_id=user_id
        )
        request_status = request.status.lower()

        if (
            request_status == status.lower()
            or request_status != RequestStatusConstants.Pending
        ):
            abort(HTTPStatus.CONFLICT, f"Request was already {request_status}")

        model = MembershipRequestModel(
            community_id=community_id,
            requested_by=user_id,
            status=status,
            reviewed_by=auth_id,
        )

        if status == RequestStatusConstants.Approved:
            scopes = [
                EntityScope(
                    user_id=user_id,
                    id=community_id,
                    scope=CommunityScopeConstants.CreateResource,
                ).to_community_json()
            ]
            self.memberships_broker.approve_request(
                model=model, community_scopes=scopes
            )
        else:
            self.memberships_broker.reject_request(model)

        message = f"Request {status}."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK

        return response
