from flask_restx import Namespace
from seta_flask_server.blueprints.admin.models import data_source_dto as dto

data_sources_ns = Namespace(
    "Data Sources", description="Admin data sources", validate=False
)
data_sources_ns.models.update(dto.ns_models)
