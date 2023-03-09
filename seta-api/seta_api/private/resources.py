from flask_restx import Model, fields

from flask_restx import Namespace, Resource, abort
from flask import current_app as app, jsonify

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
        responses={int(HTTPStatus.OK): "Verification result."  })
    @private_resource_ns.marshal_with(verification_model, mask="*")
    def get(self, id):  
        """Get a verification response for the resource identifier"""          
        
        #TODO: verify if the resource id exists in the ES
        
        return {"resource_id": id, "exists": False}
    
    @private_resource_ns.doc(description='Delete all resource data',
        responses={int(HTTPStatus.OK): "Resource deleted.", 
                    int(HTTPStatus.NOT_FOUND): "Resource id not found."})    
    def delete(self, id):
        '''Delete resource data from ES'''
        
        #TODO: check if id exists and delete all its data
        
        message = f"All data for the resource '{id}' deleted."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK
        
        return response
