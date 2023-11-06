from http import HTTPStatus
from injector import inject

from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restx import Resource, abort

from seta_flask_server.repository import interfaces
from seta_flask_server.blueprints.profile.models import apps_dto as dto
from seta_flask_server.blueprints.profile.logic.scopes_logic import group_entity_scopes
from seta_flask_server.blueprints.profile.logic.apps_logic import (
    validate_new_app_scopes,
)
from seta_flask_server.repository.models import EntityScope

from .ns import applications_ns


@applications_ns.route(
    "/<string:name>/permissions", endpoint="app_permissions", methods=["GET", "POST"]
)
@applications_ns.param("name", "Application name")
class ApplicationPermissionsResource(Resource):
    @inject
    def __init__(
        self,
        apps_broker: interfaces.IAppsBroker,
        permissions_broker: interfaces.IUserPermissionsBroker,
        resources_broker: interfaces.IResourcesBroker,
        *args,
        api=None,
        **kwargs
    ):
        super().__init__(api, *args, **kwargs)

        self.apps_broker = apps_broker
        self.permissions_broker = permissions_broker
        self.resources_broker = resources_broker

    @applications_ns.doc(
        description="Retrieve resource permissions for application.",
        responses={
            int(HTTPStatus.OK): "'Retrieved permissions list.",
            int(HTTPStatus.NOT_FOUND): "Application not found.",
        },
        security="CSRF",
    )
    @applications_ns.marshal_list_with(dto.application_scopes_details_model, mask="*")
    @jwt_required()
    def get(self, name: str):
        """Retrieves resource permissions for application."""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        app = self.apps_broker.get_by_parent_and_name(parent_id=user_id, name=name)

        if app is None:
            abort(HTTPStatus.NOT_FOUND, "Application not found")

        scopes = self.permissions_broker.get_all_user_resource_scopes(
            user_id=app.user_id
        )

        if scopes:
            grouped_scopes = group_entity_scopes(scopes=scopes, id_field="resourceId")

            for group in grouped_scopes:
                resource = self.resources_broker.get_by_id(
                    resource_id=group["resourceId"]
                )

                if resource:
                    group["title"] = resource.title
                    group["communityId"] = resource.community_id

            return grouped_scopes

        return []

    @applications_ns.doc(
        description="Replace resource permissions for application.",
        responses={
            int(HTTPStatus.OK): "'Permissions updated.",
            int(HTTPStatus.NOT_FOUND): "Application not found.",
            int(HTTPStatus.BAD_REQUEST): "Errors in payload.",
            int(HTTPStatus.EXPECTATION_FAILED): "Scope outside parent permissions.",
        },
        security="CSRF",
    )
    @applications_ns.expect([dto.application_scopes_model])
    @jwt_required(fresh=True)
    def post(self, name: str):
        """Replaces resource permissions for application."""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        app = self.apps_broker.get_by_parent_and_name(parent_id=user_id, name=name)

        if app is None:
            abort(HTTPStatus.NOT_FOUND, "Application not found")

        parent_scopes = self.permissions_broker.get_all_user_resource_scopes(
            user_id=user_id
        )

        resource_scopes = applications_ns.payload

        try:
            valid = validate_new_app_scopes(
                parent_scopes=parent_scopes, resource_scopes=resource_scopes
            )
            if not valid:
                abort(
                    HTTPStatus.EXPECTATION_FAILED,
                    {"message": "There are no resource scopes for parent user!"},
                )
        except ValueError as ve:
            abort(HTTPStatus.EXPECTATION_FAILED, ve)

        new_scopes = []
        if resource_scopes:
            for resource_scope in resource_scopes:
                scopes = resource_scope.get("scopes", None)

                if scopes:
                    for scope in scopes:
                        new_scopes.append(
                            EntityScope(
                                user_id=app.user_id,
                                id=resource_scope["resourceId"],
                                scope=scope,
                            )
                        )

        self.permissions_broker.replace_all_resource_scopes_for_user(
            user_id=app.user_id, scopes=new_scopes
        )

        return jsonify(status="success", message="Application permissions updated")
