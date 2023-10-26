from http import HTTPStatus
from injector import inject

from flask import current_app as app, json, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from flask_restx import Namespace, Resource, abort

from seta_flask_server.repository.models import (
    ResourceChangeRequestModel,
    ResourceLimitsModel,
)
from seta_flask_server.repository import interfaces
from seta_flask_server.infrastructure import scope_constants
from seta_flask_server.infrastructure import constants

from .models import resource_request_dto as dto

resource_change_request_ns = Namespace(
    "Resource Change Requests",
    validate=True,
    description="SETA Resource Change Requests",
)
resource_change_request_ns.models.update(dto.ns_models)


@resource_change_request_ns.route(
    "/<string:resource_id>/change-requests", methods=["GET", "POST"]
)
@resource_change_request_ns.param("resource_id", "Resource identifier")
class ResourceChangeRequests(Resource):
    """Handles HTTP POST requests to URL: /resources/{resource_id}/change-requests."""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        change_requests_broker: interfaces.IResourceChangeRequestsBroker,
        resources_broker: interfaces.IResourcesBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.change_requests_broker = change_requests_broker
        self.resources_broker = resources_broker

        super().__init__(api, *args, **kwargs)

    @resource_change_request_ns.doc(
        description="Add new change request for a resource field.",
        responses={
            int(HTTPStatus.CREATED): "Added new change request.",
            int(
                HTTPStatus.CONFLICT
            ): "Resource has already a pending change request for this field",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
            int(HTTPStatus.BAD_REQUEST): "Filed name or input values are wrong",
        },
        security="CSRF",
    )
    @resource_change_request_ns.expect(dto.new_change_request_parser)
    @jwt_required()
    def post(self, resource_id):
        """
        Create change request for a resource, available to resource editors
        Permission scope: "/seta/resource/edit"
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not user.has_resource_scope(
            community_id=resource_id, scope=scope_constants.ResourceScopeConstants.Edit
        ):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        request_dict = dto.new_change_request_parser.parse_args()

        field_name = request_dict["field_name"]
        if self.change_requests_broker.has_pending_field(
            resource_id=resource_id, field_name=field_name
        ):
            abort(
                HTTPStatus.CONFLICT,
                "Resource has already a pending change request for this field",
            )

        # validate field values
        new_value = request_dict["new_value"]
        old_value = request_dict["old_value"]

        match field_name:
            case constants.ResourceRequestFieldConstants.Limits:
                try:
                    ResourceLimitsModel.from_db_json(json.loads(new_value))
                except Exception:
                    app.logger.exception(new_value)
                    abort(
                        HTTPStatus.BAD_REQUEST,
                        (
                            "New value is not well formatted for limits type, "
                            f"for example {ResourceLimitsModel().to_json()}"
                        ),
                    )

                try:
                    ResourceLimitsModel.from_db_json(json.loads(old_value))
                except Exception:
                    app.logger.exception(old_value)
                    abort(
                        HTTPStatus.BAD_REQUEST,
                        (
                            "old value is not well formatted for limits type, "
                            f"for example {ResourceLimitsModel().to_json()}"
                        ),
                    )

        model = ResourceChangeRequestModel(
            resource_id=resource_id,
            field_name=field_name,
            new_value=new_value,
            old_value=old_value,
            requested_by=auth_id,
        )
        try:
            self.change_requests_broker.create(model)
        except Exception:
            app.logger.exception("ResourceCreateChangeRequest->post")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)

        response = jsonify(status="success", message="New change request added")
        response.status_code = HTTPStatus.CREATED

        return response

    @resource_change_request_ns.doc(
        description="Retrieve all change requests for a resource",
        responses={
            int(HTTPStatus.OK): "'Retrieved change requests.",
            int(HTTPStatus.NOT_FOUND): "Request not found.",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
        },
        security="CSRF",
    )
    @resource_change_request_ns.marshal_list_with(
        dto.change_request_model, mask="*", skip_none=True
    )
    @jwt_required()
    def get(self, resource_id):
        """
        Retrieve all change requests for a resource, available to community managers and resource editors

        Permission scopes: any of "/seta/community/owner", "/seta/community/manager" or "/seta/resource/edit"
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        resource = self.resources_broker.get_by_id(resource_id)
        if resource is None:
            abort(HTTPStatus.NOT_FOUND, "Resource not found")

        if not user.has_any_community_scope(
            community_id=resource.community_id,
            scopes=[
                scope_constants.CommunityScopeConstants.Manager,
                scope_constants.CommunityScopeConstants.Owner,
            ],
        ) and not user.has_resource_scope(scope_constants.ResourceScopeConstants.Edit):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        requests = self.change_requests_broker.get_all_by_resource_id(
            resource_id=resource_id
        )

        for request in requests:
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

        return requests


@resource_change_request_ns.route(
    "/<string:resource_id>/change-requests/<string:request_id>", methods=["GET"]
)
@resource_change_request_ns.param("resource_id", "Resource identifier")
@resource_change_request_ns.param("request_id", "Change request identifier")
class ResourceChangeRequest(Resource):
    """Handles HTTP requests to URL: /resources/{resource_id}/change-requests/{request_id}."""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        change_requests_broker: interfaces.IResourceChangeRequestsBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.change_requests_broker = change_requests_broker

        super().__init__(api, *args, **kwargs)

    @resource_change_request_ns.doc(
        description="Retrieve a change request for the resource.",
        responses={
            int(HTTPStatus.OK): "'Retrieved change request.",
            int(HTTPStatus.NOT_FOUND): "Request not found.",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, scope 'resource/change_request/approve' required",
        },
        security="CSRF",
    )
    @resource_change_request_ns.marshal_with(dto.change_request_model, mask="*")
    @jwt_required()
    def get(self, resource_id, request_id):
        """Retrieve resource request, available to sysadmins and initiator.

        Permissions: scope '/seta/resource/change_request/approve'
                    or "Administrator" role
                    or requested_by == authenticated_id
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        request = self.change_requests_broker.get_request(
            resource_id=resource_id, request_id=request_id
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
                    scope_constants.SystemScopeConstants.ApproveResourceChangeRequest
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
