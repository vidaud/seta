from http import HTTPStatus
from injector import inject

from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, abort

from seta_flask_server.repository import interfaces
from seta_flask_server.infrastructure.scope_constants import CommunityScopeConstants

from seta_flask_server.blueprints.communities.models import permissions_dto as dto
from .helpers.scopes_helper import group_user_scopes

permissions_ns = Namespace(
    "Resource User Permissions",
    validate=True,
    description="SETA Resource User Permissions",
)
permissions_ns.models.update(dto.ns_models)


@permissions_ns.route(
    "/resource/<string:resource_id>",
    endpoint="resource_permission_list",
    methods=["GET"],
)
@permissions_ns.param("resource_id", "Resource identifier")
class ResourcePermissionList(Resource):
    """Get a list of all resource permissions"""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        permissions_broker: interfaces.IUserPermissionsBroker,
        resources_broker: interfaces.IResourcesBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.permissions_broker = permissions_broker
        self.resources_broker = resources_broker

        super().__init__(api, *args, **kwargs)

    @permissions_ns.doc(
        description="Retrieve user-scope list for this resource.",
        responses={
            int(HTTPStatus.OK): "'Retrieved permissions list.",
            int(HTTPStatus.NOT_FOUND): "Resource not found",
        },
        security="CSRF",
    )
    @permissions_ns.marshal_list_with(dto.user_scopes_model, mask="*")
    @jwt_required()
    def get(self, resource_id):
        """
        Retrieve resource permissions for all members, available to community managers

        Permission scopes: any of "/seta/community/manager", "/seta/community/owner"
        """

        resource = self.resources_broker.get_by_id(resource_id)
        if not resource:
            abort(HTTPStatus.NOT_FOUND, "Resource not found")

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id)

        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not user.has_any_community_scope(
            community_id=resource.community_id,
            scopes=[CommunityScopeConstants.Manager, CommunityScopeConstants.Owner],
        ):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        scopes = self.permissions_broker.get_all_resource_scopes(resource_id)
        return group_user_scopes(scopes=scopes, users_broker=self.users_broker)


@permissions_ns.route(
    "/resource/<string:resource_id>/user/<string:user_id>",
    endpoint="resource_user_permissions",
    methods=["GET", "POST"],
)
@permissions_ns.param("resource_id", "Resource id")
@permissions_ns.param("user_id", "User identifier")
class ResourceUserPermissions(Resource):
    """Get a list of resource permissions for one user and expose POST for the replace of user scopes"""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        permissions_broker: interfaces.IUserPermissionsBroker,
        resources_broker: interfaces.IResourcesBroker,
        memberships_broker: interfaces.IMembershipsBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.permissions_broker = permissions_broker
        self.resources_broker = resources_broker
        self.memberships_broker = memberships_broker

        super().__init__(api, *args, **kwargs)

    @permissions_ns.doc(
        description="Retrieve resource permissions for a member.",
        responses={
            int(HTTPStatus.OK): "'Retrieved permissions list.",
            int(HTTPStatus.NOT_FOUND): "Resource or user not found",
        },
        security="CSRF",
    )
    @permissions_ns.marshal_with(dto.user_scopes_model, mask="*")
    @jwt_required()
    def get(self, resource_id, user_id):
        """
        Retrieve resource permissions for a member, available to community managers.

        Permission scopes: any of "/seta/community/manager", "/seta/community/owner"
        """

        resource = self.resources_broker.get_by_id(resource_id)
        if not resource:
            abort(HTTPStatus.NOT_FOUND, "Resource id not found")

        if not self.users_broker.user_uid_exists(user_id):
            abort(HTTPStatus.NOT_FOUND, "User id not found")

        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        user = self.users_broker.get_user_by_id(auth_id)

        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not user.has_any_community_scope(
            community_id=resource.community_id,
            scopes=[CommunityScopeConstants.Manager, CommunityScopeConstants.Owner],
        ):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        scopes = self.permissions_broker.get_user_resource_scopes_by_id(
            user_id=user_id, resource_id=resource_id
        )

        user_scopes = group_user_scopes(scopes=scopes, users_broker=self.users_broker)

        # it should be only one entry
        if user_scopes:
            return user_scopes[0]

        return None

    @permissions_ns.doc(
        description="Manage resource permissions for a member",
        responses={
            int(HTTPStatus.OK): "User permissions updated.",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
            int(HTTPStatus.NOT_FOUND): "Resource or user not found.",
            int(HTTPStatus.BAD_REQUEST): "User have to be a member of the community.",
        },
        security="CSRF",
    )
    @permissions_ns.expect(dto.resource_scopes_parser)
    @jwt_required()
    def post(self, resource_id, user_id):
        """
        Manage resource permissions for a member, available to community managers

        Permission scopes: any of "/seta/community/manager", "/seta/community/owner"
        Only an owner can edit the permissions of another owner!
        """

        resource = self.resources_broker.get_by_id(resource_id)
        if not resource:
            abort(HTTPStatus.NOT_FOUND, "Resource id not found")

        if not self.users_broker.user_uid_exists(user_id):
            abort(HTTPStatus.NOT_FOUND, "User id not found")

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id)

        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not user.has_any_community_scope(
            community_id=resource.community_id,
            scopes=[CommunityScopeConstants.Manager, CommunityScopeConstants.Owner],
        ):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not self.memberships_broker.membership_exists(
            community_id=resource.community_id, user_id=user_id
        ):
            abort(
                HTTPStatus.BAD_REQUEST,
                f"User have to be a member of the community '{resource.community_id}'!",
            )

        request_dict = dto.resource_scopes_parser.parse_args()
        scopes = request_dict["scope"]

        # verify owner scope in the list
        if scopes and CommunityScopeConstants.Owner in scopes:
            # only an owner can edit permissions for another owner
            if not user.has_community_scope(
                community_id=resource.community_id, scope=CommunityScopeConstants.Owner
            ):
                abort(
                    HTTPStatus.FORBIDDEN,
                    "Insufficient rights, you must be an owner of the community.",
                )

        self.permissions_broker.replace_all_user_resource_scopes(
            user_id=user_id, resource_id=resource_id, scopes=scopes
        )

        response = jsonify(status="success", message="User permissions updated")
        response.status_code = HTTPStatus.OK

        return response
