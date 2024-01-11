from http import HTTPStatus
from injector import inject

from flask_jwt_extended import jwt_required
from flask_restx import Namespace, Resource

from seta_flask_server.repository import interfaces
from .models import annotation_dto as dto


annotation_catalogue_ns = Namespace(
    "Annotations", validate=False, description="Document annotations"
)
annotation_catalogue_ns.models.update(dto.ns_models)


@annotation_catalogue_ns.route("", endpoint="annotations", methods=["GET"])
class AnnotationListResource(Resource):
    """Handles HTTP requests to URL: /catalogue/annotations."""

    @inject
    def __init__(
        self,
        annotations_broker: interfaces.IAnnotationsBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.annotations_broker = annotations_broker

        super().__init__(api, *args, **kwargs)

    @annotation_catalogue_ns.doc(
        description="Get all annotations",
        responses={int(HTTPStatus.OK): "Retrieved annotations."},
        security="CSRF",
    )
    @annotation_catalogue_ns.marshal_list_with(
        dto.annotation_model, mask="*", skip_none=True
    )
    @jwt_required()
    def get(self):
        """
        Retrieve all annotations
        """
        annotations = self.annotations_broker.get_all()
        return annotations
