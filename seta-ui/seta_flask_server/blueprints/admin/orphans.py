from http import HTTPStatus
from injector import inject
from werkzeug.exceptions import HTTPException

from flask import current_app as app, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, abort

from seta_flask_server.repository import interfaces
from seta_flask_server.infrastructure.constants import (
    CommunityRoleConstants,
    UserRoleConstants,
)
from seta_flask_server.infrastructure.scope_constants import CommunityScopeConstants
from seta_flask_server.repository.models import MembershipModel

from seta_flask_server.infrastructure.clients.private_api_client import (
    PrivateResourcesClient,
)

from .models import orphans_dto as dto

orphans_ns = Namespace(
    "Community Orphans", validate=True, description="SETA Community Orphan Entities"
)
orphans_ns.models.update(dto.ns_models)


@orphans_ns.route("/communities", endpoint="admin_orphan_communities", methods=["GET"])
class CommunityOrphans(Resource):
    """Handles HTTP requests to URL: /admin/orphan/communities."""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        communities_broker: interfaces.ICommunitiesBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.communities_broker = communities_broker

        super().__init__(api, *args, **kwargs)

    @orphans_ns.doc(
        description="Retrieve all communities without an assigned owner",
        responses={
            int(HTTPStatus.OK): "'Retrieved communities.",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, role 'Administrator' required",
        },
        security="CSRF",
    )
    @orphans_ns.marshal_list_with(dto.community_model)
    @jwt_required()
    def get(self):
        """
        Retrieve all communities without ownership, available to sysadmins

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        # verify scope
        user = self.users_broker.get_user_by_id(user_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if user.role.lower() != UserRoleConstants.Admin.lower():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        communities = self.communities_broker.get_orphans()

        if communities is not None:
            for community in communities:
                creator = self.users_broker.get_user_by_id(
                    user_id=community.creator_id, load_scopes=False
                )
                if creator is not None:
                    community.creator = creator.user_info

        return communities


@orphans_ns.route(
    "/communities/<string:community_id>",
    endpoint="admin_orphan_community_owner",
    methods=["POST"],
)
@orphans_ns.param("community_id", "Community identifier")
class CommunityOrphanOwner(Resource):
    """Handles HTTP requests to URL: /admin/orphan/communities/<community_id>/owner/<user_id>."""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        permissions_broker: interfaces.IUserPermissionsBroker,
        communities_broker: interfaces.ICommunitiesBroker,
        memberships_broker: interfaces.IMembershipsBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.permissions_broker = permissions_broker
        self.communities_broker = communities_broker
        self.memberships_broker = memberships_broker

        super().__init__(api, *args, **kwargs)

    @orphans_ns.doc(
        description="Set ownership for a community",
        responses={
            int(HTTPStatus.CREATED): "Community owner set.",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
            int(HTTPStatus.NOT_FOUND): "Community or user not found.",
        },
        security="CSRF",
    )
    @orphans_ns.expect(dto.set_owner_parser)
    @jwt_required()
    def post(self, community_id):
        """
        Set owner for a community, available to sysadmin

        Permission scopes: "Administrator" role
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        # verify scope
        user = self.users_broker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if user.role.lower() != UserRoleConstants.Admin.lower():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not self.communities_broker.community_id_exists(community_id):
            abort(HTTPStatus.NOT_FOUND, "Community id not found")

        request_dict = dto.set_owner_parser.parse_args()
        owner_id = request_dict["owner"]

        if not self.users_broker.user_uid_exists(owner_id):
            app.logger.error(f"User id {owner_id} not found in the database")
            abort(HTTPStatus.NOT_FOUND, "User id not found")

        if not self.memberships_broker.membership_exists(
            community_id=community_id, user_id=owner_id
        ):
            model = MembershipModel(
                community_id=community_id,
                user_id=owner_id,
                role=CommunityRoleConstants.Owner,
            )

            self.memberships_broker.create_membership(model=model)

        scopes = [
            CommunityScopeConstants.Owner,
            CommunityScopeConstants.Manager,
            CommunityScopeConstants.SendInvite,
            CommunityScopeConstants.ApproveMembershipRequest,
            CommunityScopeConstants.CreateResource,
        ]

        self.permissions_broker.replace_all_user_community_scopes(
            user_id=owner_id, community_id=community_id, scopes=scopes
        )

        response = jsonify(status="success", message="New community owner added")
        response.status_code = HTTPStatus.CREATED

        return response


@orphans_ns.route("/resources", endpoint="admin_orphan_resources", methods=["GET"])
class ResourceOrphans(Resource):
    """Handles HTTP requests to URL: /admin/orphan/resources."""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        resources_broker: interfaces.IResourcesBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.resources_broker = resources_broker

        super().__init__(api, *args, **kwargs)

    @orphans_ns.doc(
        description="Retrieve all resources without an assigned community",
        responses={
            int(HTTPStatus.OK): "'Retrieved resources.",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, role 'Administrator' required",
        },
        security="CSRF",
    )
    @jwt_required()
    def get(self):
        """
        Retrieve all resources existing in ElasticSearch, but not having a database entry, available to sysadmins

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        # verify scope
        user = self.users_broker.get_user_by_id(user_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if user.role.lower() != UserRoleConstants.Admin.lower():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        try:
            client = PrivateResourcesClient()
            codes = client.all()

            if codes is not None and codes:
                resources = self.resources_broker.get_all()

                return jsonify(
                    list(
                        filter(
                            lambda code: not any(
                                r.resource_id.lower() == code.lower() for r in resources
                            ),
                            codes,
                        )
                    )
                )

        except HTTPException:
            raise
        except Exception:
            app.logger.exception("CommunityResourceList->post")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)

        return None
