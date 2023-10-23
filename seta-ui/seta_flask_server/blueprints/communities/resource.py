from http import HTTPStatus
from injector import inject

from flask import current_app as app, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, abort

from seta_flask_server.repository.interfaces import IResourcesBroker, IUsersBroker
from seta_flask_server.repository.models import ResourceModel
from seta_flask_server.infrastructure.scope_constants import ResourceScopeConstants

from seta_flask_server.infrastructure.clients import private_api_client as api_client

from .models import resource_dto as dto

resources_ns = Namespace("Resources", description="SETA Resources")
resources_ns.models.update(dto.ns_models)


@resources_ns.route("/", endpoint="resource_list", methods=["GET"])
class UserResources(Resource):
    """Get a list of accessible resources for this authorized user"""

    @inject
    def __init__(
        self,
        users_broker: IUsersBroker,
        resources_broker: IResourcesBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.resources_broker = resources_broker

        super().__init__(api, *args, **kwargs)

    @resources_ns.doc(
        description="Retrieve list of queryable resources for the authorized user",
        responses={int(HTTPStatus.OK): "Retrieved resources."},
        security="CSRF",
    )
    @resources_ns.marshal_list_with(dto.resource_model, mask="*")
    @jwt_required()
    def get(self):
        """Retrieve list of queryable resources, available to any user"""
        identity = get_jwt_identity()
        user_id = identity["user_id"]

        resources = self.resources_broker.get_all_queryable_by_user_id(user_id)
        for resource in resources:
            creator = self.users_broker.get_user_by_id(
                resource.creator_id, load_scopes=False
            )
            if creator:
                resource.creator = creator.user_info

        return resources


@resources_ns.route("/<string:resource_id>", methods=["GET", "PUT", "DELETE"])
@resources_ns.param("resource_id", "Resource identifier")
class CommunityResource(Resource):
    """Handles HTTP requests to URL: /resources/{id}."""

    @inject
    def __init__(
        self,
        users_broker: IUsersBroker,
        resources_broker: IResourcesBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.resources_broker = resources_broker

        super().__init__(api, *args, **kwargs)

    @resources_ns.doc(
        description="Retrieve resource",
        responses={
            int(HTTPStatus.OK): "Retrieved resource.",
            int(HTTPStatus.NOT_FOUND): "Resource id not found.",
        },
        security="CSRF",
    )
    @resources_ns.marshal_with(dto.resource_model, mask="*")
    @jwt_required()
    def get(self, resource_id: str):
        """Retrieve resource, available to any user"""
        resource = self.resources_broker.get_by_id(resource_id)

        if resource is None:
            abort(HTTPStatus.NOT_FOUND)

        creator = self.users_broker.get_user_by_id(
            resource.creator_id, load_scopes=False
        )
        if creator:
            resource.creator = creator.user_info

        return resource

    @resources_ns.doc(
        description="Update resource fields",
        responses={
            int(HTTPStatus.OK): "Resource updated.",
            int(HTTPStatus.NOT_FOUND): "Resource id not found.",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
        },
        security="CSRF",
    )
    @resources_ns.expect(dto.update_resource_parser)
    @jwt_required()
    def put(self, resource_id: str):
        """
        Update a resource, available to resource editors
        Permission scope: "/seta/resource/edit"
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        # verify scope
        user = self.users_broker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        resource = self.resources_broker.get_by_id(resource_id)
        if resource is None:
            abort(HTTPStatus.NOT_FOUND)

        if not user.has_resource_scope(
            community_id=resource_id, scope=ResourceScopeConstants.Edit
        ):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        resource_dict = dto.update_resource_parser.parse_args()

        try:
            model = ResourceModel(
                resource_id=resource_id,
                community_id=None,
                title=resource_dict["title"],
                abstract=resource_dict["abstract"],
                status=resource_dict["status"],
            )

            self.resources_broker.update(model)
        except Exception:
            app.logger.exception("CommunityResource->put")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)

        message = f"Resource '{resource_id}' updated."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK

        return response

    @resources_ns.doc(
        description="Delete all resource entries",
        responses={
            int(HTTPStatus.OK): "Resource deleted.",
            int(HTTPStatus.NOT_FOUND): "Resource id not found.",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
        },
        security="CSRF",
    )
    @jwt_required()
    def delete(self, resource_id: str):
        """
        Delete resource, available to resource editors
        Permission scope: "/seta/resource/edit"
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        # verify scope
        user = self.users_broker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        app.logger.debug(user.to_json_complete())

        resource = self.resources_broker.get_by_id(resource_id)
        if resource is None:
            abort(HTTPStatus.NOT_FOUND)

        if not user.has_resource_scope(
            community_id=resource_id, scope=ResourceScopeConstants.Edit
        ):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        try:
            client = api_client.PrivateResourceClient(resource_id=resource_id)
            client.delete()

            self.resources_broker.delete(resource_id)
        except Exception:
            app.logger.exception("CommunityResource->delete")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)

        message = f"All data for the resource '{resource_id}' deleted."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK

        return response
