from flask_restx import Namespace, Resource
from flask import current_app as app, send_from_directory

ex_api = Namespace('seta-api-examples', description='Get token examples')

@ex_api.route('/example_get-token_guest.py')
class ExampleGuest(Resource):
    def get(self):
        return send_from_directory(directory='static', path=app.config['EXAMPLE_GUEST'])


@ex_api.route('/example_get-token_user.py')
class ExampleUser(Resource):
    def get(self):
        return send_from_directory(directory='static', path=app.config['EXAMPLE_USER'])