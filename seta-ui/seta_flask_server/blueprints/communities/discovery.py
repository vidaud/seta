from flask import current_app as app, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, abort

from injector import inject
from http import HTTPStatus

from seta_flask_server.repository.interfaces import ICommunitiesBroker, IUsersBroker, IResourcesBroker
from .models.community_dto import(community_model)
from .models.resource_dto import (resource_model)

discovery_ns = Namespace('Discovery', validate=True, description='Discover communities')
discovery_ns.models[community_model.name] = community_model
discovery_ns.models[resource_model.name] = resource_model

@discovery_ns.route('/communities', endpoint="discover_community_list", methods=['GET'])
class DiscoverCommunities(Resource):
    '''Get all communities'''
    
    @inject
    def __init__(self, communitiesBroker: ICommunitiesBroker, api=None, *args, **kwargs):
        self.communitiesBroker = communitiesBroker
        
        super().__init__(api, *args, **kwargs)
        
    @discovery_ns.doc(description='Retrieve community list.',        
        responses={int(HTTPStatus.OK): "'Retrieved community list."},
        security='CSRF')
    @discovery_ns.marshal_list_with(community_model, mask="*")
    @jwt_required()    
    def get(self):
        '''Retrive all communities'''   
        
        return self.communitiesBroker.get_all()
    
@discovery_ns.route('/resources', endpoint="discover_resource_list", methods=['GET'])
class DiscoverResources(Resource):
    '''Get all resources'''
    
    @inject
    def __init__(self, resourcesBroker: IResourcesBroker, api=None, *args, **kwargs):
        self.resourcesBroker = resourcesBroker
        
        super().__init__(api, *args, **kwargs)
        
    @discovery_ns.doc(description='Retrieve resource list.',        
        responses={int(HTTPStatus.OK): "'Retrieved resource list."},
        security='CSRF')
    @discovery_ns.marshal_list_with(resource_model, mask="*")
    @jwt_required()    
    def get(self):
        '''Retrive all resources'''   
        
        return self.resourcesBroker.get_all()    


