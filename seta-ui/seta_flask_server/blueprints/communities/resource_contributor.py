from flask import current_app as app, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from flask_restx import Namespace, Resource, abort

from injector import inject

from seta_flask_server.repository.interfaces import IResourcesBroker, IUsersBroker, IResourceContributorsBroker
from seta_flask_server.repository.models import ResourceContributorModel
from seta_flask_server.infrastructure.decorators import auth_validator
from seta_flask_server.infrastructure.scope_constants import ResourceScopeConstants

from http import HTTPStatus
from .models.resource_contributor_dto import (new_contributor_parser, contributor_model)

resource_contributors_ns = Namespace('Resource Contributors', description='SETA Resource Contributors')
resource_contributors_ns.models[contributor_model.name] = contributor_model

@resource_contributors_ns.route('/<string:resource_id>/contributors', methods=['POST', 'GET'])
@resource_contributors_ns.param("resource_id", "Resource identifier")
class ResourceContributorList(Resource):
    """Get the contributors of the resource and expose POST for new contributors"""
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, resourcesBroker: IResourcesBroker, contributorsBroker: IResourceContributorsBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.resourcesBroker = resourcesBroker
        self.contributorsBroker = contributorsBroker
        
        super().__init__(api, *args, **kwargs)

    @resource_contributors_ns.doc(description='Retrieve contributors for this respurce.',
        responses={int(HTTPStatus.OK): "'Retrieved contributors.",
                   int(HTTPStatus.NO_CONTENT): "Resource not found"},
        security='CSRF')
    @resource_contributors_ns.marshal_list_with(contributor_model, mask="*")
    @auth_validator()    
    def get(self, resource_id):
        '''Retrieve contributors'''

        if not self.resourcesBroker.resource_id_exists(resource_id):
            return '', HTTPStatus.NO_CONTENT

        return [c.to_json() for c in self.contributorsBroker.get_all_by_resource_id(resource_id)]

    @resource_contributors_ns.doc(description='Create new contributor.',        
        responses={int(HTTPStatus.CREATED): "Added contributor.", 
                   int(HTTPStatus.NO_CONTENT): "Resource not found",
                   int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'resource/data/add' required"},
        security='CSRF')
    @resource_contributors_ns.expect(new_contributor_parser)
    @auth_validator()
    def post(self, resource_id):
        '''Create resource contribution'''
        
        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.usersBroker.get_user_by_id(auth_id)
        if user is None:
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if not user.has_resource_scope(id=resource_id, scope=ResourceScopeConstants.DataAdd):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not self.resourcesBroker.resource_id_exists(resource_id):
            return '', HTTPStatus.NO_CONTENT

        contributor_dict = new_contributor_parser.parse_args()
        
        try:
            model = ResourceContributorModel(resource_id=resource_id, user_id=auth_id, 
                                    file_name=contributor_dict["file_name"],
                                    file_size_mb=contributor_dict["file_size_mb"],
                                    metadata=contributor_dict["metadata"]
                                    )

            self.contributorsBroker.create(model)
            
        except:
            app.logger.exception("ResourceContributorList->post")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)
        

        response = jsonify(status="success", message="New contributor added")
        response.status_code = HTTPStatus.CREATED
        
        return response