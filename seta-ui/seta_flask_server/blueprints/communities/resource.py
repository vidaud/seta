from flask import current_app as app, jsonify
from flask_jwt_extended import get_jwt_identity

from flask_restx import Namespace, Resource, abort

from injector import inject

from seta_flask_server.repository.interfaces import IResourcesBroker, IUsersBroker
from seta_flask_server.repository.models import ResourceModel
from seta_flask_server.infrastructure.decorators import auth_validator
from seta_flask_server.infrastructure.scope_constants import ResourceScopeConstants, CommunityScopeConstants
from seta_flask_server.infrastructure.clients.private_api_client import PrivateResourceClient

from http import HTTPStatus
from .models.resource_dto import (update_resource_parser, resource_model, resource_limits_model)

resources_ns = Namespace('Resources', description='SETA Resources')
resources_ns.models[resource_limits_model.name] = resource_limits_model
resources_ns.models[resource_model.name] = resource_model 

@resources_ns.route('/', endpoint="resource_list", methods=['GET'])
class UserResources(Resource):
    '''Get a list of accessible resources for this authorized user'''
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, resourcesBroker: IResourcesBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.resourcesBroker = resourcesBroker
        
        super().__init__(api, *args, **kwargs)
        
    @resources_ns.doc(description='Retrieve list of accessible resources for this authorized user',        
        responses={int(HTTPStatus.OK): "Retrieved resources."  },
        security='CSRF')
    @resources_ns.marshal_list_with(resource_model, mask="*")
    @auth_validator()
    def get(self):
        '''Retrieve list of accessible resources'''      
        identity = get_jwt_identity()
        user_id = identity["user_id"]     
                  
        return self.resourcesBroker.get_all_queryable_by_user_id(user_id)

@resources_ns.route('/<string:id>', methods=['GET', 'PUT', 'DELETE'])
@resources_ns.param("id", "Resource identifier")
class CommunityResource(Resource):
    """Handles HTTP requests to URL: /resources/{id}."""

    @inject
    def __init__(self, usersBroker: IUsersBroker, resourcesBroker: IResourcesBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.resourcesBroker = resourcesBroker
        
        super().__init__(api, *args, **kwargs)

    @resources_ns.doc(description='Retrieve resource',        
        responses={int(HTTPStatus.OK): "Retrieved resource.",
                   int(HTTPStatus.NOT_FOUND): "Resource id not found."
                  },
        security='CSRF')
    @resources_ns.marshal_with(resource_model, mask="*")
    @auth_validator()
    def get(self, id):
        '''Retrieve resource'''                
        resource = self.resourcesBroker.get_by_id(id)
        
        if resource is None:
            abort(HTTPStatus.NOT_FOUND)
        
        return resource

    @resources_ns.doc(description='Update resource fields',        
        responses={int(HTTPStatus.OK): "Resource updated.", 
                   int(HTTPStatus.NOT_FOUND): "Resource id not found.",
                   int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'resource/edit' required"},
        security='CSRF')
    @resources_ns.expect(update_resource_parser)
    @auth_validator()
    def put(self, id):
        '''Update a resource'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        #verify scope
        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        resource = self.resourcesBroker.get_by_id(id)
        if resource is None:
            abort(HTTPStatus.NOT_FOUND)

        community_scopes = [CommunityScopeConstants.Owner, CommunityScopeConstants.Manager]
        if not user.has_resource_scope(id=id, scope=ResourceScopeConstants.Edit) and not user.has_any_community_scope(id=resource.community_id, scopes=community_scopes):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")      
        
        resource_dict = update_resource_parser.parse_args()

        try:            
            model = ResourceModel(resource_id=id, community_id=None, title=resource_dict["title"], 
                            abstract=resource_dict["abstract"], status=resource_dict["status"])
            
            self.resourcesBroker.update(model)
        except:
            app.logger.exception("CommunityResource->put")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)   
            
        message = f"Resource '{id}' updated."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK
        
        return response

    @resources_ns.doc(description='Delete all resource entries',
        responses={int(HTTPStatus.OK): "Resource deleted.", 
                    int(HTTPStatus.NOT_FOUND): "Resource id not found.",
                   int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'resource/edit' required"},
        security='CSRF')
    @auth_validator()
    def delete(self, id):
        '''Delete resource'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        #verify scope
        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        app.logger.debug(user.to_json_complete())

        resource = self.resourcesBroker.get_by_id(id)
        if resource is None:
            abort(HTTPStatus.NOT_FOUND)

        community_scopes = [CommunityScopeConstants.Owner, CommunityScopeConstants.Manager]
        if not user.has_resource_scope(id=id, scope=ResourceScopeConstants.Edit) and not user.has_any_community_scope(id=resource.community_id, scopes=community_scopes):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        try:            
            client = PrivateResourceClient(resource_id=id)
            client.delete()
            
            self.resourcesBroker.delete(id)            
        except:
            app.logger.exception("CommunityResource->delete")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)   
            
        message = f"All data for the resource '{id}' deleted."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK
        
        return response