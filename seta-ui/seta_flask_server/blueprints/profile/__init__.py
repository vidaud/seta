from flask_restx import Api
from flask import Blueprint, current_app

from .info import account_info_ns
from .rsa import rsa_ns
from .apps import applications_ns

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

doc='/me/doc'
if current_app.config.get("DISABLE_SWAGGER_DOCUMENTATION"):
    doc = False

profile_bp_v1 = Blueprint('profile-api-v1', __name__)
profile_api = Api(profile_bp_v1,
            title='SeTA User Profile API',
            version='1.0',
            description='User Profile API',
            doc=doc,
            authorizations=authorizations,
            default_swagger_filename="me/swagger_profile.json"
         )

profile_api.add_namespace(account_info_ns, path="/me")
profile_api.add_namespace(rsa_ns, path="/me")
profile_api.add_namespace(applications_ns, path="/me")