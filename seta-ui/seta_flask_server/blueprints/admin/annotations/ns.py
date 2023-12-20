from flask_restx import Namespace
from seta_flask_server.blueprints.admin.models import annotation_dto as dto

annotations_ns = Namespace(
    "Annotations", validate=False, description="Document annotations"
)
annotations_ns.models.update(dto.ns_models)
