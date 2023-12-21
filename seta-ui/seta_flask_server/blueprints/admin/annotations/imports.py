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


@annotations_ns.route("/import", endpoint="admin_import_annotations", methods=["POST"])
class AnnotationsImportResource(Resource):
    """Handles HTTP requests to URL: /admin/annotations/import."""

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
        description="Import annotations.",
        responses={
            int(HTTPStatus.OK): "Import completed.",
            int(HTTPStatus.BAD_REQUEST): "Errors in request payload",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
        },
        security="CSRF",
    )
    @annotations_ns.expect(dto.annotation_list)
    @annotations_ns.response(
        int(HTTPStatus.OK), "", dto.response_dto.response_message_model
    )
    @annotations_ns.response(
        int(HTTPStatus.BAD_REQUEST), "Bad payload", dto.response_dto.error_model
    )
    @jwt_required()
    def post(self):
        """Import annotations, available to sysadmin

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id, load_scopes=False)
        if not user_logic.is_admin(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        annotations = []
        categories = []
        payload = annotations_ns.payload.get("annotations")

        if not payload:
            abort(HTTPStatus.BAD_REQUEST, message="Empty import")

        for idx, json in enumerate(payload):
            try:
                annotation = annotations_logic.build_new_annotation(payload=json)

                annotations.append(annotation)
                if annotation.category not in categories:
                    categories.append(annotation.category)
            except PayloadErrors as pe:
                e = BadRequest()
                e.data = pe.response_data
                e.data["errors"]["index"] = idx
                raise e  # pylint: disable=raise-missing-from
            except Exception:
                current_app.logger.exception("AnnotationsResource->post")
                abort()

        self.annotations_broker.bulk_import(
            categories=categories, annotations=annotations
        )

        return jsonify(status="success", message="Import completed.")
