from http import HTTPStatus
from injector import inject

from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restx import Resource, abort

from seta_flask_server.repository import interfaces
from seta_flask_server.blueprints.profile.models import apps_dto as dto

from .ns import applications_ns


@applications_ns.route(
    "/<string:name>/permissions", endpoint="app_permissions", methods=["GET", "POST"]
)
@applications_ns.param("name", "Application name")
class ApplicationPermissionsResource(Resource):
    @inject
    def __init__(self, apps_broker: interfaces.IAppsBroker, *args, api=None, **kwargs):
        super().__init__(api, *args, **kwargs)

        self.apps_broker = apps_broker

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

        return []
