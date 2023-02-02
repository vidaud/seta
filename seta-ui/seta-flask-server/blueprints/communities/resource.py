from flask import current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity

from flask_restx import Namespace, Resource, abort

from injector import inject

from repository.interfaces import IResourcesBroker, IUsersBroker, ICommunitiesBroker
from repository.models import ResourceModel, ResourceLimitsModel
from infrastructure.decorators import auth_validator
from infrastructure.scope_constants import ResourceScopeConstants

from http import HTTPStatus
from .models.resource_dto import (new_resource_parser, update_resource_parser, resource_model, resource_limits_model)

resources_ns = Namespace('resources', description='SETA Resources')
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
        if not user.has_community_scope(id=id, scope=ResourceScopeConstants.Create):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        

@resources_ns.route('/<string:id>')
class UserResource(Resource):
    def get(self):
        return {'hello': 'world'}