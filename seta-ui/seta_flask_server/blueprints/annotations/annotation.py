from http import HTTPStatus
from injector import inject

from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from seta_flask_server.repository import interfaces

from .models import annotation_dto as dto

annotations_ns = Namespace("Annotations", description="List annotations")
annotations_ns.models.update(dto.ns_models)


@annotations_ns.route("", endpoint="annotations", methods=["GET"])
class AnnotationsResource(Resource):
    @inject
    def __init__(
        self,
        annotations_broker: interfaces.IAnnotationsBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.annotations_broker = annotations_broker
        self.profile_broker = profile_broker

        super().__init__(api, *args, **kwargs)

    @annotations_ns.doc(
        description="Get a list of annotations available",
        responses={int(HTTPStatus.OK): "Retrieved annotations."},
        security="CSRF",
    )
    @annotations_ns.marshal_list_with(dto.annotations_model, mask="*", skip_none=True)
    @jwt_required()
    def get(self):
        """Get a list of annotations available, available to any user"""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        annotations = self.annotations_broker.get_all()
        response = []

        for annotation in annotations:
            ds_dict = annotation.to_dict(
                exclude={"modified_at"}
            )


            response.append(ds_dict)

        return response
