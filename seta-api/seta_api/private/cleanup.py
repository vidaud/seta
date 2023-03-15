from flask_restx import Namespace, Resource, abort
from flask import current_app as app, jsonify

from http import HTTPStatus

private_cleanup_ns = Namespace('Private api cleanup', description='Cleanup ES')


@private_cleanup_ns.route('/', methods=['POST'])
class PrivateSetaResource(Resource):

    @private_cleanup_ns.doc(description='Delete all data from ES',
                            responses={int(HTTPStatus.OK): "All data deleted."})
    def post(self):
        """Celanup ElasticSearch data for Testing"""
        if not app.testing:
            abort(403, "Function available for TESTING only")
        body = {"query": {"match_all": {}}}
        try:
            app.es.delete_by_query(index=app.config['INDEX_PUBLIC'], body=body)
        except Exception as ex:
            message = str(ex)
            app.logger.exception(message)
            abort(401, message)

        message = "ElasticSearch data was removed."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK

        return response
