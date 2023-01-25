from flask_restx import Api
from flask import Blueprint
from .community import communities_ns
from .resource import resources_ns

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

communities_bp_v1 = Blueprint('communities-api-v1', __name__)

api = Api(communities_bp_v1,
         title='SeTA Communities API',
         version='1.0',
         description='SeTA Communities API',
         doc='/doc',
         authorizations=authorizations
         )

api.add_namespace(communities_ns)
api.add_namespace(resources_ns)