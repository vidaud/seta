from flask import current_app as app, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from flask_restx import Namespace, Resource, abort

from injector import inject

from repository.interfaces import IResourcesBroker, IUsersBroker, ICommunitiesBroker
from repository.models import ResourceModel
from infrastructure.decorators import auth_validator
from infrastructure.scope_constants import ResourceScopeConstants

from http import HTTPStatus
from .models.resource_dto import (new_resource_parser, update_resource_parser, resource_model, resource_limits_model)

resources_ns = Namespace('Resources', description='SETA Resources')
resources_ns.models[resource_limits_model.name] = resource_limits_model
resources_ns.models[resource_model.name] = resource_model

@resources_ns.route('/communities/<string:community_id>/resources', methods=['POST', 'GET'])
@resources_ns.param("community_id", "Community identifier")
class CommunityResourceList(Resource):
    """Get the resources of the community and expose POST for new resources"""
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, resourcesBroker: IResourcesBroker, communitiesBroker: ICommunitiesBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.resourcesBroker = resourcesBroker
        self.communitiesBroker = communitiesBroker
        
        super().__init__(api, *args, **kwargs)

    @resources_ns.doc(description='Retrieve resources for this community.',
        responses={int(HTTPStatus.OK): "'Retrieved resources.",
                   int(HTTPStatus.NOT_FOUND): "Community not found"},
        security='CSRF')
    @resources_ns.marshal_list_with(resource_model, mask="*")
    @auth_validator()    
    def get(self, community_id):
        '''Retrieve resources'''

        if not self.communitiesBroker.community_id_exists(community_id):
            abort(HTTPStatus.NOT_FOUND, "Community id not found.")

        return self.resourcesBroker.get_all_by_community_id(community_id)

    @resources_ns.doc(description='Create new resource.',        
        responses={int(HTTPStatus.CREATED): "Added resource.", 
                   int(HTTPStatus.NOT_FOUND): "Community not found",
                   int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'resource/create' required"},
        security='CSRF')
    @resources_ns.expect(new_resource_parser)
    @auth_validator()
    def post(self, community_id):
        '''Create resource'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None:
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if not user.has_community_scope(id=community_id, scope=ResourceScopeConstants.Create):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not self.communitiesBroker.community_id_exists(community_id):
            abort(HTTPStatus.NOT_FOUND, "Community id not found.")

        resource_dict = new_resource_parser.parse_args()
        
        try:
            
            resource_id = resource_dict["resource_id"]
            id_exists = self.resourcesBroker.resource_id_exists(resource_id)
                       
            if not id_exists:
                model = ResourceModel(resource_id=resource_id, community_id=community_id, 
                                    title=resource_dict["title"], abstract=resource_dict["abstract"],                                    
                                    creator_id=identity["user_id"])
                
                self.resourcesBroker.create(model)
        except:
            app.logger.exception("CommunityResourceList->post")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)
        
        if id_exists:
            error = f"Resource id '{resource_id}' already exists, must be unique."
            abort(HTTPStatus.CONFLICT, error, status="fail")


        response = jsonify(status="success", message="New resource  added")
        response.status_code = HTTPStatus.CREATED
        
        return response
        

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
    def get(self, id):
        '''Retrieve resource'''                
        resource = self.resourcesBroker.get_by_id(id)
        
        if resource is None:
            abort(HTTPStatus.NOT_FOUND, "Resource id not found.")
        
        return resource

    @resources_ns.doc(description='Update resource fields',        
        responses={int(HTTPStatus.OK): "Resource updated.", 
                   int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'resource/edit' required"},
        security='CSRF')
    @resources_ns.expect(update_resource_parser)
    @auth_validator()
    def put(self, id):
        '''Update a resource'''
        
        identity = get_jwt_identity()
        auth_id = identity["auth_id"]
        
        #verify scope
        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None:
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if not user.has_resource_scope(id=id, scope=ResourceScopeConstants.Edit):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")       
        
        resource_dict = update_resource_parser.parse_args()

        try:            
            model = ResourceModel(resource_id=id, title=resource_dict["title"], 
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
                   int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'resource/edit' required"},
        security='CSRF')
    @auth_validator()
    def delete(self, id):
        '''Delete resource'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]
        
        #verify scope
        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None:
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if not user.has_resource_scope(id=id, scope=ResourceScopeConstants.Edit):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        try:            
            self.resourcesBroker.delete(id)
            
            #TODO: delete resource from elastic search (from here or from the client side?)
        except:
            app.logger.exception("CommunityResource->delete")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)   
            
        message = f"All data for the resource '{id}' deleted."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK
        
        return response