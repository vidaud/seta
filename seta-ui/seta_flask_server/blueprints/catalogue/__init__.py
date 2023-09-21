from flask_restx import Api
from flask import Blueprint, current_app

from .scopes import scope_catalogue_ns
from .roles import role_catalogue_ns

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

doc='/catalogue/doc'
if current_app.config.get("DISABLE_SWAGGER_DOCUMENTATION"):
    doc = False

catalogue_bp_v1 = Blueprint('catalogue-api-v1', __name__)
catalogue_api = Api(catalogue_bp_v1,
            title='SeTA Catalogues API',
            version='1.0',
            description='Catalogue API',
            doc=doc,
            authorizations=authorizations,
            default_swagger_filename="catalogue/swagger_catalogue.json"
         )

catalogue_api.add_namespace(scope_catalogue_ns, path="/catalogue")
catalogue_api.add_namespace(role_catalogue_ns, path="/catalogue")