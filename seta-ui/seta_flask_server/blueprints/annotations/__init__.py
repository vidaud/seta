from flask_restx import Api
from flask import Blueprint, current_app

from seta_flask_server.infrastructure.dto.authorizations import authorizations

from .annotation import annotations_ns

DOC = "/annotations/doc"
if current_app.config.get("DISABLE_SWAGGER_DOCUMENTATION"):
    DOC = False

annotations_bp_v1 = Blueprint("annotations-api-v1", __name__)
annotations_api = Api(
    annotations_bp_v1,
    title="SeTA Annotations API",
    version="1.0",
    description="Annotations API",
    doc=DOC,
    authorizations=authorizations,
    default_swagger_filename="annotations/swagger_annotations.json",
)

annotations_api.add_namespace(annotations_ns, path="/annotations")
