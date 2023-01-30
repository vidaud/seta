from flask import current_app as app, jsonify
from flask_jwt_extended import get_jwt_identity

from flask_restx import Namespace, Resource, abort

from injector import inject

from repository.models import CommunityModel
from repository.interfaces import ICommunitiesBroker, IUsersBroker
from infrastructure.decorators import auth_validator
from infrastructure.scope_constants import CommunityScopeConstants

from http import HTTPStatus
from .models.community_dto import(new_community_parser, update_community_parser, community_model, community_creator_model)

communities_ns = Namespace('Communities', validate=True, description='SETA Communities')
communities_ns.models[community_creator_model.name] = community_creator_model
communities_ns.models[community_model.name] = community_model

@communities_ns.route('/', endpoint="community_list", methods=['GET', 'POST'])
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
    @communities_ns.marshal_list_with(community_model, mask="*")
    @auth_validator()    
    def get(self):
        '''Retrive user communities'''
        
        identity = get_jwt_identity()
        user_id = identity["user_id"]        
        
        return self.communitiesBroker.get_all_by_user_id(user_id)
    
    @communities_ns.doc(description='Create a new community and add this user as a member with elevated scopes.',        
        responses={int(HTTPStatus.CREATED): "Added new community.", 
                   int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/create' required",
                   int(HTTPStatus.CONFLICT): "Community already exists."},
        security='CSRF')
    @communities_ns.expect(new_community_parser)
    @auth_validator()
    def post(self):
        '''Create a community'''
        
        identity = get_jwt_identity()
        user_id = identity["user_id"]
        id_exists = False
        
        community_dict = new_community_parser.parse_args()
        
        #TODO: move scopes to JWT token and validate trough decorator
        #verify scope
        user = self.usersBroker.get_user_by_id(user_id)
        if not any(cs.scope == CommunityScopeConstants.Create for cs in user.system_scopes):
            response = jsonify({"message": "Insufficient rights"})
            response.status_code = int(HTTPStatus.FORBIDDEN)
            return response
        
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
    
@communities_ns.route('/<string:id>', endpoint="community", methods=['GET', 'PUT', 'DELETE'])
@communities_ns.param("id", "Community id")
class Community(Resource):
    """Handles HTTP requests to URL: /communities/{id}."""
    
    @inject
    def __init__(self, usersBroker: IUsersBroker, communitiesBroker: ICommunitiesBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.communitiesBroker = communitiesBroker
        
        super().__init__(api, *args, **kwargs)
    
    @communities_ns.doc(description='Retrieve community, if user is a member of it',        
        responses={int(HTTPStatus.OK): "Retrieved community.",
                   int(HTTPStatus.NOT_FOUND): "Community id not found."
                  },
        security='CSRF')
    @communities_ns.marshal_with(community_model, mask="*")
    @auth_validator()
    def get(self, id):
        '''Retrieve community'''                
        community = self.communitiesBroker.get_by_id(id)
        
        if community is None:
            abort(HTTPStatus.NOT_FOUND, "Community id not found.")
        
        return community
    
    @communities_ns.doc(description='Update community fields',        
        responses={int(HTTPStatus.OK): "Community updated.", 
                   int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/edit' required"},
        security='CSRF')
    @communities_ns.expect(update_community_parser)
    @auth_validator()
    def put(self, id):
        '''Update a community'''
        
        identity = get_jwt_identity()
        user_id = identity["user_id"]
        
        #TODO: move scopes to JWT token and validate trough decorator
        #verify scope
        user = self.usersBroker.get_user_by_id(user_id)
        if not any(cs.id.lower() == id.lower() and cs.scope == CommunityScopeConstants.Edit for cs in user.community_scopes):
            response = jsonify({"message": "Insufficient rights"})
            response.status_code = int(HTTPStatus.FORBIDDEN)
            return response
        
        
        community_dict = update_community_parser.parse_args()
        
        try:            
            model = CommunityModel(id, community_dict["title"], community_dict["description"], 
                                    None, community_dict["data_type"], community_dict["status"], user_id)
            
            self.communitiesBroker.update(model)
        except:
            app.logger.exception("Community->put")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)   
            
        message = f"Community '{id}' updated."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK
        
        return response
    
    @communities_ns.doc(description='Dalete  community entries',
        responses={int(HTTPStatus.OK): "Community deleted.", 
                   int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/edit' required"},
        security='CSRF')
    @auth_validator()
    def delete(self, id):
        '''Delete community'''
        
        identity = get_jwt_identity()
        user_id = identity["user_id"]
        
        #TODO: move scopes to JWT token and validate trough decorator
        #verify scope
        user = self.usersBroker.get_user_by_id(user_id)
        if not any(cs.id.lower() == id.lower() and cs.scope == CommunityScopeConstants.Edit for cs in user.community_scopes):
            response = jsonify({"message": "Insufficient rights"})
            response.status_code = int(HTTPStatus.FORBIDDEN)
            return response
        
        try:            
            self.communitiesBroker.delete(id)
            
            #TODO: delete resource from elastic search (from here or from the client side?)
        except:
            app.logger.exception("Community->delete")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)   
            
        message = f"All data for community '{id}' deleted."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK
        
        return response