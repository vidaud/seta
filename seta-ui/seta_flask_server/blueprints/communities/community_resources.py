from http import HTTPStatus
from injector import inject

from werkzeug.exceptions import HTTPException

from flask import current_app as app, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, abort

from seta_flask_server.repository.interfaces import (
    IResourcesBroker,
    IUsersBroker,
    ICommunitiesBroker,
)
from seta_flask_server.infrastructure.scope_constants import CommunityScopeConstants
from seta_flask_server.infrastructure.clients.private_api_client import (
    PrivateResourceClient,
)

from .models import resource_dto as dto

from .logic.community_resources_logic import parse_args_new_resource

community_resources_ns = Namespace(
    "Community Resources", description="SETA Community Resources"
)
community_resources_ns.models.update(dto.ns_models)


@community_resources_ns.route(
    "/<string:community_id>/resources", methods=["POST", "GET"]
)
@community_resources_ns.param("community_id", "Community identifier")
class CommunityResourceList(Resource):
    """Get the resources of the community and expose POST for new resources"""

    @inject
    def __init__(
        self,
        users_broker: IUsersBroker,
        resources_broker: IResourcesBroker,
        communities_broker: ICommunitiesBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.resources_broker = resources_broker
        self.communities_broker = communities_broker

        super().__init__(api, *args, **kwargs)

    @community_resources_ns.doc(
        description="Retrieve resources for this community.",
        responses={
            int(HTTPStatus.OK): "'Retrieved resources.",
            int(HTTPStatus.NOT_FOUND): "Community not found",
        },
        security="CSRF",
    )
    @community_resources_ns.marshal_list_with(dto.resource_model, mask="*")
    @jwt_required()
    def get(self, community_id):
        """Retrieve community resources, available to any user"""

        if not self.communities_broker.community_id_exists(community_id):
            abort(HTTPStatus.NOT_FOUND)

        resources = self.resources_broker.get_all_by_community_id(community_id)

        for resource in resources:
            creator = self.users_broker.get_user_by_id(
                resource.creator_id, load_scopes=False
            )
            if creator:
                resource.creator = creator.user_info

        return resources

    @community_resources_ns.doc(
        description="Create resource.",
        responses={
            int(HTTPStatus.CREATED): "Added resource.",
            int(HTTPStatus.NOT_FOUND): "Community not found",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
        },
        security="CSRF",
    )
    @community_resources_ns.expect(dto.new_resource_parser)
    @jwt_required()
    def post(self, community_id):
        """
        Create resource, available to community members.

        Permission scope: "/seta/resource/create"
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not self.communities_broker.community_id_exists(community_id):
            abort(HTTPStatus.NOT_FOUND, "Community id not found!")

        if not user.has_community_scope(
            community_id=community_id, scope=CommunityScopeConstants.CreateResource
        ):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        resource_dict = dto.new_resource_parser.parse_args()

        try:
            resource_id = resource_dict["resource_id"]
            id_exists = self.resources_broker.resource_id_exists(resource_id)

            if not id_exists:
                # verify for orphan resources in seta-api
                client = PrivateResourceClient(resource_id=resource_id)
                id_exists = client.exists()

            if id_exists:
                error = f"Resource id '{resource_id}' already exists, must be unique."
                abort(HTTPStatus.CONFLICT, error, status="fail")

            model, scopes = parse_args_new_resource(
                creator_id=auth_id,
                community_id=community_id,
                resource_dict=resource_dict,
            )

            self.resources_broker.create(model=model, scopes=scopes)
        except HTTPException:
            raise
        except Exception:
            app.logger.exception("CommunityResourceList->post")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)

        response = jsonify(status="success", message="New resource  added")
        response.status_code = HTTPStatus.CREATED

        return response
