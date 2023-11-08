from flask_restx import Api
from flask import Blueprint, current_app

from .info import account_info_ns
from .rsa import rsa_ns
from .rsa_key import rsa_key_ns
from .apps import applications_ns
from .scopes import scopes_ns
from .resources import resources_ns
from .library import library_ns

authorizations = {
    "Bearer": {
        "type": "apiKey",
        "in": "header",
        "name": "Authorization",
        "description": "Type in the *'Value'* input box below: **'Bearer &lt;JWT&gt;'**, where JWT is the token",
    },
    "CSRF": {
        "type": "apiKey",
        "in": "header",
        "name": "X-CSRF-TOKEN",
        "description": "Type in the *'Value'* input box below: **'&lt;CSRF&gt;'**, where CSRF is the CSRF token",
    },
}

DOC = "/me/doc"
if current_app.config.get("DISABLE_SWAGGER_DOCUMENTATION"):
    DOC = False

profile_bp_v1 = Blueprint("profile-api-v1", __name__)
profile_api = Api(
    profile_bp_v1,
    title="SeTA User Profile API",
    version="1.0",
    description="User Profile API",
    doc=DOC,
    authorizations=authorizations,
    default_swagger_filename="me/swagger_profile.json",
)

profile_api.add_namespace(account_info_ns, path="/me")
profile_api.add_namespace(rsa_ns, path="/me")
profile_api.add_namespace(rsa_key_ns, path="/me/rsa-key")
profile_api.add_namespace(applications_ns, path="/me/apps")
profile_api.add_namespace(scopes_ns, path="/me")
profile_api.add_namespace(resources_ns, path="/me")
profile_api.add_namespace(library_ns, path="/me")
