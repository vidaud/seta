from flask_restx import Api
from flask import Blueprint, current_app

from .change_requests import change_requests_ns
from .orphans import orphans_ns
from .stats import stats_ns
from .users import users_ns
from .rolling_indexes import rolling_indexes_ns
from .data_sources import data_sources_ns

from seta_flask_server.infrastructure.dto.authorizations import authorizations

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

admin_api.add_namespace(change_requests_ns, path="/admin")
admin_api.add_namespace(orphans_ns, path="/admin/orphan")
admin_api.add_namespace(stats_ns, path="/admin/stats")
admin_api.add_namespace(users_ns, path="/admin/users")
admin_api.add_namespace(rolling_indexes_ns, path="/admin")
admin_api.add_namespace(data_sources_ns, path="/admin/data-sources")
