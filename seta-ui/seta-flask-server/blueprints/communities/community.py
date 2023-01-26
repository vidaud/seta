from flask import current_app as app, jsonify
from flask_jwt_extended import get_jwt_identity

from flask_restx import Namespace, Resource, abort

from injector import inject

from repository.models import CommunityModel
from repository.interfaces import ICommunitiesBroker, IUsersBroker
from infrastructure.decorators import auth_validator

from http import HTTPStatus
from .models.community_dto import(new_community_parser, update_community_parser, community_model)

communities_ns = Namespace('communities', validate=True, description='SETA Communities')
communities_ns.models[community_model.name] = community_model

@communities_ns.route('/', endpoint="community_list")
class CommunityList(Resource):
    '''Get a list of communities with this authorized user membership and expose POST for new communities'''
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, communitiesBroker: ICommunitiesBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.communitiesBroker = communitiesBroker
        
        super().__init__(api, *args, **kwargs)
    
    @communities_ns.doc(description='Retrieve community list for this user.',        
        responses={int(HTTPStatus.OK): "'Retrieved community list."},
        security='CSRF')
    @communities_ns.marshal_with(community_model, mask="*")
    @auth_validator()    
    def get(self):
        '''Retrive user communities'''
        
        identity = get_jwt_identity()
        return self.communitiesBroker.get_all_by_user_id(identity["user_id"])
    
    @communities_ns.doc(description='Create a new community and add this user as a member with elevated scopes.',        
        responses={int(HTTPStatus.CREATED): "Added new community.", 
                   int(HTTPStatus.FORBIDDEN): "Insufficient rights",
                   int(HTTPStatus.CONFLICT): "Community already exists."},
        security='CSRF')
    @communities_ns.expect(new_community_parser)
    @auth_validator()
    def post(self):
        '''Create a community'''
        
        identity = get_jwt_identity()
        id_exists = False
        
        community_dict = new_community_parser.parse_args()
        
        try:
            
            community_id = community_dict["community_id"]
            id_exists = self.communitiesBroker.community_id_exists(community_id)
                       
            if not id_exists:
                model = CommunityModel(community_id, community_dict["title"], community_dict["description"], 
                                    "open", community_dict["data_type"], "active", identity["user_id"])
                
                self.communitiesBroker.create(model)
        except:
            app.logger.exception("CommunityList->post")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)
        
        if id_exists:
            error = f"Community id '{community_id}' already exists, must be unique."
            abort(HTTPStatus.CONFLICT, error, status="fail")
                
        response = jsonify(status="success", message="New community added")
        response.status_code = HTTPStatus.CREATED
        
        return response
    
@communities_ns.route('/<string:id>', endpoint="community")
@communities_ns.param("id", "Community id")
class Community(Resource):
    """Handles HTTP requests to URL: /communities/{id}."""
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, communitiesBroker: ICommunitiesBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.communitiesBroker = communitiesBroker
        
        super().__init__(api, *args, **kwargs)
    
    @communities_ns.doc(description='Retrieve community',        
        responses={int(HTTPStatus.OK): "Retrieved community.",
                   int(HTTPStatus.NOT_FOUND): "Community id not found.",
                   int(HTTPStatus.FORBIDDEN): "Insufficient rights"},
        security='CSRF')
    @communities_ns.marshal_list_with(community_model, mask="*")
    @auth_validator()
    def get(self, id):
        community = self.communitiesBroker.get_by_id(id)
        
        if not community:
            abort(HTTPStatus.NOT_FOUND, "Community id not found.")
        
        return community.to_json()
    
    @communities_ns.doc(description='Update community fields',        
        responses={int(HTTPStatus.OK): "Community updated.", 
                   int(HTTPStatus.FORBIDDEN): "Insufficient rights"},
        security='CSRF')
    @communities_ns.expect(update_community_parser)
    @auth_validator()
    def put(self, id):
        identity = get_jwt_identity()
        community_dict = update_community_parser.parse_args()
        
        try:            
            model = CommunityModel(id, community_dict["title"], community_dict["description"], 
                                    None, community_dict["data_type"], community_dict["status"], identity["user_id"])
            
            self.communitiesBroker.update(model)
        except:
            app.logger.exception("Community->put")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)   
            
        message = f"Community '{id}' updated."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK
        
        return response     
    
@communities_ns.route('/<string:id>/resources', endpoint="community_resources")
@communities_ns.param("id", "Community id")
class CommunityResources(Resource):
    @inject
    def __init__(self, usersBroker: IUsersBroker, communitiesBroker: ICommunitiesBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.communitiesBroker = communitiesBroker
        
        super().__init__(api, *args, **kwargs)
    
    @auth_validator()
    def get(self, id):
        return {'hello': 'world'}    
