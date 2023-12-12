from http import HTTPStatus
from injector import inject

from werkzeug.exceptions import BadRequest
from flask import jsonify, current_app
from flask_restx import Namespace, Resource, abort
from flask_jwt_extended import jwt_required, get_jwt_identity

from seta_flask_server.repository import interfaces

from seta_flask_server.infrastructure.dto.payload_errors import PayloadErrors
from seta_flask_server.blueprints.admin.logic import user_logic, annotations_logic
from .models import annotation_dto as dto

annotations_ns = Namespace(
    "Annotations", description="Admin annotations", validate=False
)
annotations_ns.models.update(dto.ns_models)


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
    @annotations_ns.marshal_list_with(
        dto.annotation_model, mask="*", skip_none=True
    )
    @jwt_required()
    def get(self):
        """
        Retrieve all annotations, available to sysadmin,

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        # verify scope
        user = self.users_broker.get_user_by_id(auth_id)
        if not user_logic.can_approve_resource_cr(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        annotations = self.annotations_broker.get_all(active_only=False)

        return annotations

    @annotations_ns.doc(
        description="Create annotation.",
        responses={
            int(HTTPStatus.CREATED): "Created annotation.",
            int(HTTPStatus.BAD_REQUEST): "Errors in request payload",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
        },
        security="CSRF",
    )
    @annotations_ns.expect(dto.new_annotation_model)
    @annotations_ns.response(
        int(HTTPStatus.CREATED), "", dto.response_dto.response_message_model
    )
    @annotations_ns.response(
        int(HTTPStatus.BAD_REQUEST), "Bad payload", dto.response_dto.error_model
    )
    @jwt_required()
    def post(self):
        """Create a new annotation, available to sysadmins.

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id, load_scopes=False)
        if not user_logic.is_admin(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        try:
            annotation = annotations_logic.build_new_annotation(
                payload=annotations_ns.payload,
                broker=self.annotations_broker,
            )

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


@annotations_ns.route(
    "/<string:annotation_id>", endpoint="admin_annotation", methods=["PUT"]
)
@annotations_ns.param("annotation_id", "Annotation identifier")
@annotations_ns.response(int(HTTPStatus.BAD_REQUEST), "", dto.response_dto.error_model)
class AnnotationResource(Resource):
    """Handles HTTP requests to URL: /admin/annotations/{annotation_id}."""

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
    def put(self, annotation_id: str):
        """
        Updates an annotation, available to sysadmins

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id, load_scopes=False)
        if not user_logic.is_admin(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        annotation = self.annotations_broker.get_by_id(annotation_id)
        if annotation is None:
            abort(HTTPStatus.NOT_FOUND, message="Annotation not found.")

        try:
            update_annotation = annotations_logic.build_update_annotation(
                broker=self.annotations_broker,
                payload=annotations_ns.payload,
                annotation=annotation,
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
