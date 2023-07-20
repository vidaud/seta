from flask_restx import Api
from flask import Blueprint, current_app

from .notifications import notifications_ns

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

doc='/notifications/doc'
if current_app.config.get("DISABLE_SWAGGER_DOCUMENTATION"):
    doc = False

notifications_bp_v1 = Blueprint('notifications-api-v1', __name__)
notifications_api = Api( notifications_bp_v1,
         title='SeTA Notifications API',
         version='1.0',
         description='SeTA Notifications API',
         doc=doc,
         authorizations=authorizations,
         default_swagger_filename="notifications/swagger_notifications.json"
         )

notifications_api.add_namespace(notifications_ns, path="/notifications")