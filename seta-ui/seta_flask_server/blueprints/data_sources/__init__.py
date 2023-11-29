from flask_restx import Api
from flask import Blueprint, current_app

from seta_flask_server.infrastructure.dto.authorizations import authorizations

from .data_source import data_sources_ns

DOC = "/data-sources/doc"
if current_app.config.get("DISABLE_SWAGGER_DOCUMENTATION"):
    DOC = False

data_sources_bp_v1 = Blueprint("data-sources-api-v1", __name__)
data_sources_api = Api(
    data_sources_bp_v1,
    title="SeTA Data Sources API",
    version="1.0",
    description="Data Sources API",
    doc=DOC,
    authorizations=authorizations,
    default_swagger_filename="data-sources/swagger_data_sources.json",
)

data_sources_api.add_namespace(data_sources_ns, path="/data-sources")
