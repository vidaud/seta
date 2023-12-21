from flask_restx import Api
from flask import Blueprint, current_app

from seta_flask_server.infrastructure.dto.authorizations import authorizations

from .stats import stats_ns
from .users import users_ns
from .data_sources import data_sources_ns
from .annotations import annotations_ns

DOC = "/admin/doc"
if current_app.config.get("DISABLE_SWAGGER_DOCUMENTATION"):
    DOC = False

admin_bp = Blueprint("admin-api", __name__)
admin_api = Api(
    admin_bp,
    title="SeTA SysAdmin API",
    version="1.0",
    description="SeTA SysAdmin API",
    doc=DOC,
    authorizations=authorizations,
    default_swagger_filename="admin/swagger_admin.json",
)

admin_api.add_namespace(stats_ns, path="/admin/stats")
admin_api.add_namespace(users_ns, path="/admin/users")
admin_api.add_namespace(data_sources_ns, path="/admin/data-sources")
admin_api.add_namespace(annotations_ns, path="/admin/annotations")
