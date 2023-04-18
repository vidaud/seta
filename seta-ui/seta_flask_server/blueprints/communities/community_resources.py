from flask import current_app as app, jsonify
from flask_jwt_extended import get_jwt_identity
from werkzeug.exceptions import HTTPException

from flask_restx import Namespace, Resource, abort

from injector import inject

from seta_flask_server.repository.interfaces import IResourcesBroker, IUsersBroker, ICommunitiesBroker
from seta_flask_server.repository.models import ResourceModel, EntityScope
from seta_flask_server.infrastructure.decorators import auth_validator
from seta_flask_server.infrastructure.scope_constants import ResourceScopeConstants, CommunityScopeConstants
from seta_flask_server.infrastructure.clients.private_api_client import PrivateResourceClient

from http import HTTPStatus
from .models.resource_dto import (new_resource_parser, resource_model, resource_limits_model)

community_resources_ns = Namespace('Community Resources', description='SETA Community Resources')
community_resources_ns.models[resource_limits_model.name] = resource_limits_model
community_resources_ns.models[resource_model.name] = resource_model

@community_resources_ns.route('/<string:community_id>/resources', methods=['POST', 'GET'])
@community_resources_ns.param("community_id", "Community identifier")
class CommunityResourceList(Resource):
    """Get the resources of the community and expose POST for new resources"""
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, resourcesBroker: IResourcesBroker, communitiesBroker: ICommunitiesBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.resourcesBroker = resourcesBroker
        self.communitiesBroker = communitiesBroker
        
        super().__init__(api, *args, **kwargs)

    @community_resources_ns.doc(description='Retrieve resources for this community.',
        responses={int(HTTPStatus.OK): "'Retrieved resources.",
                   int(HTTPStatus.NOT_FOUND): "Community not found"},
        security='CSRF')
    @community_resources_ns.marshal_list_with(resource_model, mask="*")
    @auth_validator()    
    def get(self, community_id):
        '''Retrieve resources'''

        if not self.communitiesBroker.community_id_exists(community_id):
            abort(HTTPStatus.NOT_FOUND)

        return self.resourcesBroker.get_all_by_community_id(community_id)

    @community_resources_ns.doc(description='Create new resource.',        
        responses={int(HTTPStatus.CREATED): "Added resource.", 
                   int(HTTPStatus.NOT_FOUND): "Community not found",
                   int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'resource/create' required"},
        security='CSRF')
    @community_resources_ns.expect(new_resource_parser)
    @auth_validator()
    def post(self, community_id):
        '''Create resource'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None:
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not self.communitiesBroker.community_id_exists(community_id):
            abort(HTTPStatus.NOT_FOUND)

        if not user.has_community_scope(id=community_id, scope=CommunityScopeConstants.CreateResource):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")        

        resource_dict = new_resource_parser.parse_args()
        
        try:
            
            resource_id = resource_dict["resource_id"]
            id_exists = self.resourcesBroker.resource_id_exists(resource_id)
                        
            if not id_exists:
                # verify for orphan resources in seta-api
                client = PrivateResourceClient(resource_id=resource_id)
                id_exists = client.exists()
            
            if id_exists:
                error = f"Resource id '{resource_id}' already exists, must be unique."
                abort(HTTPStatus.CONFLICT, error, status="fail")           
            
            model = ResourceModel(resource_id=resource_id, community_id=community_id, 
                                title=resource_dict["title"], abstract=resource_dict["abstract"],
                                creator_id=identity["user_id"])

                #set resouce scopes for the creator_id
            scopes = [
                EntityScope(user_id=model.creator_id,  id=model.resource_id, scope=ResourceScopeConstants.Edit).to_resource_json(),
                EntityScope(user_id=model.creator_id,  id=model.resource_id, scope=ResourceScopeConstants.DataAdd).to_resource_json(),
                EntityScope(user_id=model.creator_id,  id=model.resource_id, scope=ResourceScopeConstants.DataDelete).to_resource_json()
                        ]
            
            self.resourcesBroker.create(model=model,scopes=scopes)
        except HTTPException:
            raise
        except:
            app.logger.exception("CommunityResourceList->post")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)


        response = jsonify(status="success", message="New resource  added")
        response.status_code = HTTPStatus.CREATED
        
        return response