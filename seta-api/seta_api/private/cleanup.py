from flask_restx import Namespace, Resource
from flask import current_app as app, jsonify

from http import HTTPStatus

private_cleanup_ns = Namespace('Private api cleanup', description='Cleanup ES')

@private_cleanup_ns.route('/', methods=['POST'])
class PrivateSetaResource(Resource):

    @private_cleanup_ns.doc(description='Delete all data from ES',
        responses={int(HTTPStatus.OK): "All data deleted."})
    def post(self):
        """Celanup ElasticSearch data"""
        
        #TODO: cleanup all data from ES
        
        message = "ElasticSearch data was removed."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK
        
        return response