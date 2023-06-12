from datetime import datetime
import pytz

from flask import jsonify, current_app
from flask_jwt_extended import get_jwt_identity, jwt_required

from flask_restx import Namespace, Resource
from injector import inject
from http import HTTPStatus

from seta_flask_server.repository.models.resource import ResourceModel

from seta_flask_server.repository.models import UserProfileResources
from seta_flask_server.repository.interfaces import IUserProfile, IResourcesBroker

from .models.resources_dto import resource_model, resources_parser

resources_ns = Namespace('Restricted resources', validate=True, description='Manage unsearchable resources')
resources_ns.models[resource_model.name] = resource_model

@resources_ns.route('/resources', endpoint="discover_community_list", methods=['GET','POST'])
class Unsearchables(Resource):
    '''User unsearchables'''

    @inject
    def __init__(self, profileBroker: IUserProfile, 
                 resourcesBroker: IResourcesBroker,
                 api=None, *args, **kwargs):        
        self.profileBroker = profileBroker
        self.resourcesBroker = resourcesBroker
        
        super().__init__(api, *args, **kwargs)

    @resources_ns.doc(description='Retrieve restricted resources for this user.',        
        responses={int(HTTPStatus.OK): "'Retrieved resources."},
        security='CSRF')
    @resources_ns.marshal_list_with(resource_model, mask="*", skip_none=True)
    @jwt_required()    
    def get(self):
        '''Retrive restricted resources for the authenticated user'''
        
        identity = get_jwt_identity()
        user_id = identity["user_id"]        
        
        ids = self.profileBroker.get_unsearchables(user_id)
        current_app.logger.debug("get_unsearchables :" + str(ids))

        if ids is None or len(ids) == 0:
            return None

        resources = []

        for resource_id in ids:
            resource = self.resourcesBroker.get_by_id(resource_id)

            if resource is None:
                resource = ResourceModel(resource_id=resource_id, community_id="unknown", title="Unknown resource", abstract="None", status="unknown")

            resources.append(resource)

        return resources
    
    @resources_ns.doc(description='Update restricted resources.',        
    responses={int(HTTPStatus.OK): "Restricted resources updated."},
    security='CSRF')
    @resources_ns.expect(resources_parser)
    @jwt_required()
    def post(self):
        '''Create an application'''
        
        identity = get_jwt_identity()
        user_id = identity["user_id"]
        
        request_dict = resources_parser.parse_args()
        ids = request_dict["resource"]

        if ids is None or len(ids) == 0:
            self.profileBroker.delete_unsearchables(user_id)
            message = "Restricted list deleted"
        else:
            self.profileBroker.upsert_unsearchables(UserProfileResources(user_id=user_id, 
                                                        resources=ids, 
                                                        timestamp=datetime.now(tz=pytz.utc))
                                                    )
            
            message = "Restricted list updated"
            
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK
        
        return response