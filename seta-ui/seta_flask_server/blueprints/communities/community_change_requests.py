from http import HTTPStatus
from injector import inject

from flask import current_app as app, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, abort

from seta_flask_server.repository.models import CommunityChangeRequestModel
from seta_flask_server.repository import interfaces

from seta_flask_server.infrastructure import scope_constants
from seta_flask_server.infrastructure import constants

from .models import community_dto as dto

community_change_request_ns = Namespace(
    "Community Change Requests",
    validate=True,
    description="SETA Community Change Requests",
)
community_change_request_ns.models.update(dto.ns_cr_models)


@community_change_request_ns.route(
    "/<string:community_id>/change-requests",
    endpoint="community_create_change_request",
    methods=["GET", "POST"],
)
@community_change_request_ns.param("community_id", "Community identifier")
class CommunityChangeRequests(Resource):
    """Handles HTTP POST requests to URL: /communities/{community_id}/change-requests."""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        change_requests_broker: interfaces.ICommunityChangeRequestsBroker,
        resource_requests_broker: interfaces.IResourceChangeRequestsBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.change_requests_broker = change_requests_broker
        self.resource_requests_broker = resource_requests_broker

        super().__init__(api, *args, **kwargs)

    @community_change_request_ns.doc(
        description="Create a change request for a community field.",
        responses={
            int(HTTPStatus.CREATED): "New change request created.",
            int(
                HTTPStatus.CONFLICT
            ): "Community has already a pending change request for this field",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, scope 'community/manager' or 'community/owner' required",
            int(HTTPStatus.BAD_REQUEST): "Filed name or input values are wrong",
        },
        security="CSRF",
    )
    @community_change_request_ns.expect(dto.new_change_request_parser)
    @jwt_required()
    def post(self, community_id):
        """
        Create a community change request, available to community managers

        Permission scopes: either '/seta/community/owner' or '/seta/community/manager'
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not user.has_any_community_scope(
            community_id=community_id,
            scopes=[
                scope_constants.CommunityScopeConstants.Manager,
                scope_constants.CommunityScopeConstants.Owner,
            ],
        ):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        request_dict = dto.new_change_request_parser.parse_args()

        field_name = request_dict["field_name"]
        if self.change_requests_broker.has_pending_field(
            community_id=community_id, field_name=field_name
        ):
            abort(
                HTTPStatus.CONFLICT,
                "Community has already a pending change request for this field",
            )

        # validate field values
        new_value = request_dict["new_value"]
        old_value = request_dict["old_value"]

        match field_name:
            case constants.CommunityRequestFieldConstants.Membership:
                if not new_value in constants.CommunityMembershipConstants.List:
                    abort(
                        HTTPStatus.BAD_REQUEST,
                        f"New value has to be one of {constants.CommunityMembershipConstants.List}",
                    )
                if not old_value in constants.CommunityMembershipConstants.List:
                    abort(
                        HTTPStatus.BAD_REQUEST,
                        f"Old value has to be one of {constants.CommunityMembershipConstants.List}",
                    )

        model = CommunityChangeRequestModel(
            community_id=community_id,
            field_name=field_name,
            new_value=new_value,
            old_value=old_value,
            status=constants.RequestStatusConstants.Pending,
            requested_by=auth_id,
        )
        try:
            self.change_requests_broker.create(model)
        except Exception:
            app.logger.exception("CreateChangeRequest->post")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)

        message = "New change request added"

        if app.config.get("AUTO_APPROVE_CHANGE_REQUEST", False):
            try:
                model.status = constants.RequestStatusConstants.Approved
                model.reviewed_by = "system"

                self.change_requests_broker.update(model)

                message = "Change request approved!"
            except Exception:
                app.logger.exception("CreateChangeRequest->auto_approve")

        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.CREATED

        return response

    @community_change_request_ns.doc(
        description="Retrieve all change requests for a community and its resources",
        responses={
            int(HTTPStatus.OK): "'Retrieved change requests.",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, scope 'community/manager' or 'community/owner' required",
        },
        security="CSRF",
    )
    @community_change_request_ns.marshal_with(dto.all_change_requests_model, mask="*")
    @jwt_required()
    def get(self, community_id):
        """
        Retrieve all change requests for a community and its resources, available to community managers

        Permission scopes: either '/seta/community/owner' or '/seta/community/manager'
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not user.has_any_community_scope(
            community_id=community_id,
            scopes=[
                scope_constants.CommunityScopeConstants.Manager,
                scope_constants.CommunityScopeConstants.Owner,
            ],
        ):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        community_change_requests = self.change_requests_broker.get_all_by_community_id(
            community_id
        )
        resource_change_requests = (
            self.resource_requests_broker.get_all_by_community_id(community_id)
        )

        # add community crs infos
        for community_request in community_change_requests:
            requested_by = self.users_broker.get_user_by_id(
                community_request.requested_by, load_scopes=False
            )
            if requested_by:
                community_request.requested_by_info = requested_by.user_info

            if community_request.reviewed_by:
                reviewed_by = self.users_broker.get_user_by_id(
                    community_request.reviewed_by, load_scopes=False
                )
                if reviewed_by:
                    community_request.reviewed_by_info = reviewed_by.user_info

        # add resource crs infos
        for resource_request in resource_change_requests:
            requested_by = self.users_broker.get_user_by_id(
                resource_request.requested_by, load_scopes=False
            )
            if requested_by:
                resource_request.requested_by_info = requested_by.user_info

            if resource_request.reviewed_by:
                reviewed_by = self.users_broker.get_user_by_id(
                    resource_request.reviewed_by, load_scopes=False
                )
                if reviewed_by:
                    resource_request.reviewed_by_info = reviewed_by.user_info

        return {
            "community_change_requests": community_change_requests,
            "resource_change_requests": resource_change_requests,
        }


@community_change_request_ns.route(
    "/<string:community_id>/change-requests/<string:request_id>",
    endpoint="community_change_request",
    methods=["GET"],
)
@community_change_request_ns.param("community_id", "Community identifier")
@community_change_request_ns.param("request_id", "Change request identifier")
class CommunityChangeRequest(Resource):
    """Handles HTTP requests to URL: /communities/{community_id}/change-requests/{request_id}."""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        change_requests_broker: interfaces.ICommunityChangeRequestsBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.change_requests_broker = change_requests_broker

        super().__init__(api, *args, **kwargs)

    @community_change_request_ns.doc(
        description="Retrieve a change request for a community.",
        responses={
            int(HTTPStatus.OK): "'Retrieved change request.",
            int(HTTPStatus.NOT_FOUND): "Request not found.",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, scope 'community/change_request/approve' required",
        },
        security="CSRF",
    )
    @community_change_request_ns.marshal_with(dto.change_request_model, mask="*")
    @jwt_required()
    def get(self, community_id, request_id):
        """Retrieve a community change request, available to sysadmins and initiator.

        Permissions: scope '/seta/community/change_request/approve'
                or "Administrator" role
                or requested_by == authenticated_id
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        request = self.change_requests_broker.get_request(
            community_id=community_id, request_id=request_id
        )

        if request is None:
            abort(HTTPStatus.NOT_FOUND)

        user = self.users_broker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        # if not the initiator of the request, verify ApproveChangeRequest scope
        if request.requested_by != auth_id:
            has_approve_right = (
                user.role.lower() == constants.UserRoleConstants.Admin.lower()
                or user.has_system_scope(
                    scope_constants.SystemScopeConstants.ApproveCommunityChangeRequest
                )
            )
            if not has_approve_right:
                abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

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
