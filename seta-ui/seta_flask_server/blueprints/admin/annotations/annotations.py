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


@annotations_ns.route("", endpoint="admin_annotations", methods=["GET", "POST"])
class AnnotationsResource(Resource):
    """Handles HTTP requests to URL: /admin/annotations."""

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
        description="Get all annotations",
        responses={
            int(HTTPStatus.OK): "Retrieved annotations.",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, role 'Administrator' required",
        },
        security="CSRF",
    )
    @annotations_ns.marshal_list_with(dto.annotation_model, mask="*", skip_none=True)
    @jwt_required()
    def get(self):
        """
        Retrieve all annotations, available to sysadmin

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        # verify scope
        user = self.users_broker.get_user_by_id(auth_id)
        if not user_logic.can_approve_resource_cr(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        annotations = self.annotations_broker.get_all()
        return annotations

    @annotations_ns.doc(
        description="Create annotation.",
        responses={
            int(HTTPStatus.CREATED): "Created annotation.",
            int(HTTPStatus.BAD_REQUEST): "Errors in request payload",
            int(HTTPStatus.CONFLICT): "Label already exists.",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
        },
        security="CSRF",
    )
    @annotations_ns.expect(dto.annotation_model)
    @annotations_ns.response(
        int(HTTPStatus.CREATED), "", dto.response_dto.response_message_model
    )
    @annotations_ns.response(
        int(HTTPStatus.BAD_REQUEST), "Bad payload", dto.response_dto.error_model
    )
    @jwt_required()
    def post(self):
        """Create a new annotation, available to sysadmin

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id, load_scopes=False)
        if not user_logic.is_admin(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        payload = annotations_ns.payload
        if "label" in payload.keys() and self.annotations_broker.label_exists(
            payload["label"]
        ):
            abort(HTTPStatus.CONFLICT, "Label already exists")

        try:
            annotation = annotations_logic.build_new_annotation(payload=payload)

            self.annotations_broker.create(annotation)
        except PayloadErrors as pe:
            e = BadRequest()
            e.data = pe.response_data
            raise e  # pylint: disable=raise-missing-from
        except Exception:
            current_app.logger.exception("AnnotationsResource->post")
            abort()

        response = jsonify(status="success", message="Annotation created.")
        response.status_code = HTTPStatus.CREATED

        return response
