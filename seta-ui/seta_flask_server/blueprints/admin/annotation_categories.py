from http import HTTPStatus
from injector import inject

from werkzeug.exceptions import BadRequest
from flask import jsonify, current_app
from flask_restx import Namespace, Resource, abort
from flask_jwt_extended import jwt_required, get_jwt_identity

from seta_flask_server.repository import interfaces

from seta_flask_server.infrastructure.dto.payload_errors import PayloadErrors
from seta_flask_server.blueprints.admin.logic import user_logic, annotations_logic
from .models import annotation_categories_dto as dto

annotation_categories_ns = Namespace(
    "Annotation Categories", description="Admin annotation categories", validate=False
)
annotation_categories_ns.models.update(dto.ns_models)


@annotation_categories_ns.route("", endpoint="admin_annotation_categories", methods=["GET"])
class AnnotationCategoriesResource(Resource):
    """Handles HTTP requests to URL: /admin/annotation_categories."""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        annotation_categories_broker: interfaces.IAnnotationCategoriesBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.annotation_categories_broker = annotation_categories_broker

        super().__init__(api, *args, **kwargs)

    @annotation_categories_ns.doc(
        description="Get all annotation categories",
        responses={
            int(HTTPStatus.OK): "Retrieved annotation categories.",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, role 'Administrator' required",
        },
        security="CSRF",
    )
    @annotation_categories_ns.marshal_list_with(
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

        # verify scope
        user = self.users_broker.get_user_by_id(auth_id)
        if not user_logic.can_approve_resource_cr(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        annotation_categories = self.annotation_categories_broker.get_all(active_only=False)

        return annotation_categories

@annotation_categories_ns.route(
    "/<string:category_id>", endpoint="admin_annotation_category", methods=["GET"]
)
@annotation_categories_ns.param("category_id", "Annotation identifier")
@annotation_categories_ns.response(int(HTTPStatus.BAD_REQUEST), "", dto.response_dto.error_model)
class AnnotationCategoryResource(Resource):
    """Handles HTTP requests to URL: /admin/annotation_categories/{category_id}."""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        annotation_categories_broker: interfaces.IAnnotationCategoriesBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.annotation_categories_broker = annotation_categories_broker

        super().__init__(api, *args, **kwargs)

    @annotation_categories_ns.doc(
        description="Get annotation category by id",
        responses={
            int(HTTPStatus.OK): "Retrieved annotation category.",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, role 'Administrator' required",
        },
        security="CSRF",
    )
    @annotation_categories_ns.response(
        int(HTTPStatus.OK), "", dto.response_dto.response_message_model
    )
    @annotation_categories_ns.marshal_list_with(
        dto.annotation_category_model, mask="*", skip_none=True
    )
    @jwt_required()
    def get(self, category_id: str):
        """
        Retrieve annotation category by id, available to sysadmin

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        # verify scope
        user = self.users_broker.get_user_by_id(auth_id)
        if not user_logic.can_approve_resource_cr(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        annotation_categories = self.annotation_categories_broker.get_by_id(category_id)

        return annotation_categories