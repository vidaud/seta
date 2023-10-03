from flask_restx import Api
from flask import Blueprint, current_app

from .change_requests import change_requests_ns
from .orphans import orphans_ns
from .stats import stats_ns
from .users import users_ns
from .user import user_ns

authorizations = {
    'Bearer': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization',
        'description': "Type in the *'Value'* input box below: **'Bearer &lt;JWT&gt;'**, where JWT is the token"
    },
    'CSRF': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'X-CSRF-TOKEN',
        'description': "Type in the *'Value'* input box below: **'&lt;CSRF&gt;'**, where CSRF is the CSRF token"
    }
}

doc='/admin/doc'
if current_app.config.get("DISABLE_SWAGGER_DOCUMENTATION"):
    doc = False

admin_bp = Blueprint('admin-api', __name__)
admin_api = Api(admin_bp,
         title='SeTA SysAdmin API',
         version='1.0',
         description='SeTA SysAdmin API',
         doc=doc,
         authorizations=authorizations,
         default_swagger_filename="admin/swagger_admin.json"
         )

admin_api.add_namespace(change_requests_ns, path="/admin")
admin_api.add_namespace(orphans_ns, path="/admin/orphan")
admin_api.add_namespace(stats_ns, path="/admin/stats")
admin_api.add_namespace(users_ns, path="/admin/users")
admin_api.add_namespace(user_ns, path="/admin/users")