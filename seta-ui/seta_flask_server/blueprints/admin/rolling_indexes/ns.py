from flask_restx import Namespace
from seta_flask_server.blueprints.admin.models import rolling_index_dto as dto

rolling_indexes_ns = Namespace(
    "Rolling Indexes", validate=True, description="Rolling Indexes for Data Storage"
)
rolling_indexes_ns.models.update(dto.ns_models)
