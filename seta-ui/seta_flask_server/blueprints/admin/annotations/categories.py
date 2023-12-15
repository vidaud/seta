from http import HTTPStatus
from injector import inject

from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Resource, abort

from seta_flask_server.repository import interfaces
from seta_flask_server.blueprints.admin.models import annotation_dto as dto
from seta_flask_server.blueprints.admin.logic import user_logic

from .ns import annotations_ns


@annotations_ns.route(
    "/categories", endpoint="admin_annotation_categories", methods=["GET"]
)
class AnnotationCategoriesResource(Resource):
    """Handles HTTP requests to URL: /admin/annotations/categories."""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        annotation_broker: interfaces.IAnnotationsBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.annotation_broker = annotation_broker

        super().__init__(api, *args, **kwargs)

    @annotations_ns.doc(
        description="Get annotation categories",
        responses={
            int(HTTPStatus.OK): "Retrieved annotation categories.",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, role 'Administrator' required",
        },
        security="CSRF",
    )
    @annotations_ns.marshal_list_with(
        dto.annotation_category_model, mask="*", skip_none=True
    )
    @jwt_required()
    def get(self):
        """
        Retrieve all annotation categories, available to sysadmin

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id)
        if not user_logic.is_admin(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        annotation_categories = self.annotation_broker.get_categories()

        return [{"category": category} for category in annotation_categories]
