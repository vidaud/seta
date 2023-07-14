from flask_restx import Model, fields

from flask_restx import Namespace, Resource, abort
from flask import current_app as app, jsonify

from .resources_logic import resource_exists, get_all_resource

from http import HTTPStatus

private_resource_ns = Namespace('Private api resource', description='Resource helper methods')

verification_model = Model("ResourceExists",
                           {
                               "resource_id": fields.String(description="Resource identifier"),
                               "exists": fields.Boolean(description="Flag for resource id existance")
                           })
private_resource_ns.models[verification_model.name] = verification_model


@private_resource_ns.route('/<string:id>', methods=['GET', 'DELETE'])
@private_resource_ns.param("id", "Resource identifier")
class PrivateSetaResource(Resource):

    @private_resource_ns.doc(description='Check if resource exists',
                             responses={int(HTTPStatus.OK): "Verification result."})
    @private_resource_ns.marshal_with(verification_model, mask="*")
    def get(self, id):
        """Get a verification response for the resource identifier"""
        res_exists = resource_exists(id, current_app=app)
        return {"resource_id": id, "exists": res_exists}

    @private_resource_ns.doc(description='Delete all resource data',
                             responses={int(HTTPStatus.OK): "Resource deleted.",
                                        int(HTTPStatus.INTERNAL_SERVER_ERROR): "ElasticSearch delete query failed."})
    def delete(self, id):
        """Delete resource data from ES"""

        if resource_exists(id, current_app=app):
            body = {"query": {"bool": {"must": [{"match": {"source.keyword": id}}]}}}
            try:
                app.es.delete_by_query(index=app.config['INDEX_PUBLIC'], body=body)
            except Exception as ex:
                message = str(ex)
                app.logger.exception(message)

                # it's safe to forward the error message
                abort(HTTPStatus.INTERNAL_SERVER_ERROR, message)

        message = f"All data for the resource '{id}' deleted."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK

        return response


all_response = {"resources": fields.List(fields.String())}
all_response_model = private_resource_ns.model("all_response", all_response)


@private_resource_ns.route('/all', methods=['GET'])
class PrivateSetaAllResource(Resource):

    @private_resource_ns.doc(description='Return a list of all resouces.')
    @private_resource_ns.response(200, 'Success', all_response_model)
    def get(self):
        """Get a list of all the resources"""
        res_list = get_all_resource(current_app=app)
        return {"resources": res_list}
