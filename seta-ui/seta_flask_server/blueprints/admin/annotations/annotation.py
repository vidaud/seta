from http import HTTPStatus
from injector import inject
from werkzeug.exceptions import BadRequest

from flask import current_app, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Resource, abort

from seta_flask_server.repository import interfaces
from seta_flask_server.infrastructure.dto.payload_errors import PayloadErrors

from seta_flask_server.blueprints.admin.models import annotation_dto as dto
from seta_flask_server.blueprints.admin.logic import user_logic, annotations_logic

from .ns import annotations_ns


@annotations_ns.route(
    "/<string:label>",
    endpoint="admin_annotation",
    methods=["GET", "PUT", "DELETE"],
)
@annotations_ns.param("label", "Annotation label")
@annotations_ns.response(int(HTTPStatus.BAD_REQUEST), "", dto.response_dto.error_model)
class AnnotationResource(Resource):
    """Handles HTTP requests to URL: /admin/annotations/{label}."""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        annotations_broker: interfaces.IAnnotationsBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.annotations_broker = annotations_broker

        super().__init__(api, *args, **kwargs)

    @annotations_ns.doc(
        description="Get annotation by label",
        responses={
            int(HTTPStatus.OK): "Retrieved annotation.",
            int(HTTPStatus.NOT_FOUND): "Annotation not found.",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, role 'Administrator' required",
        },
        security="CSRF",
    )
    @annotations_ns.response(
        int(HTTPStatus.OK), "", dto.response_dto.response_message_model
    )
    @annotations_ns.marshal_with(dto.annotation_model, mask="*", skip_none=True)
    @jwt_required()
    def get(self, label: str):
        """
        Retrieve annotation, available to sysadmin

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        # verify scope
        user = self.users_broker.get_user_by_id(auth_id)
        if not user_logic.is_admin(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        annotation = self.annotations_broker.get_by_label(label)

        if annotation is None:
            abort(HTTPStatus.NOT_FOUND, message="Annotation not found.")

        return annotation

    @annotations_ns.doc(
        description="Update annotation",
        responses={
            int(HTTPStatus.OK): "Annotation updated.",
            int(HTTPStatus.BAD_REQUEST): "Errors in request payload",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
            int(HTTPStatus.NOT_FOUND): "Annotation not found.",
        },
        security="CSRF",
    )
    @annotations_ns.response(
        int(HTTPStatus.OK), "", dto.response_dto.response_message_model
    )
    @annotations_ns.expect(dto.update_annotation_model)
    @jwt_required()
    def put(self, label: str):
        """
        Updates an annotation, available to sysadmin

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id, load_scopes=False)
        if not user_logic.is_admin(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        annotation = self.annotations_broker.get_by_label(label)
        if annotation is None:
            abort(HTTPStatus.NOT_FOUND, message="Annotation not found.")

        try:
            payload = annotations_ns.payload
            payload["label"] = label

            update_annotation = annotations_logic.build_update_annotation(
                payload=payload
            )

            self.annotations_broker.update(update_annotation)
        except PayloadErrors as pe:
            e = BadRequest()
            e.data = pe.response_data
            raise e  # pylint: disable=raise-missing-from
        except Exception:
            current_app.logger.exception("AnnotationResource->put")
            abort()

        return jsonify(status="success", message="Annotation updated.")

    @annotations_ns.doc(
        description="Delete annotation",
        responses={
            int(HTTPStatus.OK): "Annotation deleted.",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
            int(HTTPStatus.NOT_FOUND): "Annotation not found.",
        },
        security="CSRF",
    )
    @jwt_required()
    def delete(self, label: str):
        """
        Delete annotation, available to sysadmin

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id, load_scopes=False)
        if not user_logic.is_admin(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not self.annotations_broker.label_exists(label):
            abort(HTTPStatus.NOT_FOUND, message="Annotation not found.")

        self.annotations_broker.delete(label)

        return jsonify(status="success", message="Annotation deleted.")
