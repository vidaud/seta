from flask import current_app as app, jsonify
from flask_jwt_extended import get_jwt_identity

from flask_restx import Namespace, Resource, abort

from injector import inject

from seta_flask_server.repository.models import CommunityModel, EntityScope
from seta_flask_server.repository.interfaces import ICommunitiesBroker, IUsersBroker, IResourcesBroker
from seta_flask_server.infrastructure.decorators import auth_validator
from seta_flask_server.infrastructure.scope_constants import CommunityScopeConstants, SystemScopeConstants
from seta_flask_server.infrastructure.constants import CommunityMembershipConstants, CommunityStatusConstants

from seta_flask_server.infrastructure.clients.private_api_client import PrivateResourceClient

from http import HTTPStatus
from .models.community_dto import(new_community_parser, update_community_parser, community_model, user_info_model)

communities_ns = Namespace('Communities', validate=True, description='SETA Communities')
communities_ns.models[user_info_model.name] = user_info_model
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
    @communities_ns.marshal_list_with(community_model, mask="*", skip_none=True)
    @auth_validator()    
    def get(self):
        '''Retrive user communities, available for any user'''
        
        identity = get_jwt_identity()
        user_id = identity["user_id"]        
        
        communities = self.communitiesBroker.get_all_by_user_id(user_id)

        for community in communities:
            creator = self.usersBroker.get_user_by_id(community.creator_id, load_scopes=False)
            if creator:
                community.creator = creator.user_info

        return communities

    
    @communities_ns.doc(description='Create a new community and add this user as a member with elevated scopes.',        
        responses={int(HTTPStatus.CREATED): "Added new community.", 
                   int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope '/seta/community/create' required",
                   int(HTTPStatus.CONFLICT): "Community already exists."},
        security='CSRF')
    @communities_ns.expect(new_community_parser)
    @auth_validator()
    def post(self):
        '''Create a community, available for any user'''
        
        identity = get_jwt_identity()
        user_id = identity["user_id"]
        id_exists = False
                
        #TODO: move scopes to JWT token and validate trough decorator
        #verify scope
        user = self.usersBroker.get_user_by_id(user_id)
        if user is None or user.is_not_active():            
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not user.has_system_scope(scope=SystemScopeConstants.CreateCommunity):            
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        
        community_dict = new_community_parser.parse_args()
        
        try:
            
            community_id = community_dict["community_id"]
            id_exists = self.communitiesBroker.community_id_exists(community_id)
                       
            if not id_exists:
                model = CommunityModel(community_id=community_id, 
                                       title=community_dict["title"], 
                                       description=community_dict["description"], 
                                        membership=CommunityMembershipConstants.Closed, 
                                        status=CommunityStatusConstants.Active, 
                                        creator_id=identity["user_id"])

                scopes = [
                    EntityScope(user_id=model.creator_id,  id=model.community_id, scope=CommunityScopeConstants.Owner).to_community_json(),
                    EntityScope(user_id=model.creator_id,  id=model.community_id, scope=CommunityScopeConstants.Manager).to_community_json(),                    
                    EntityScope(user_id=model.creator_id,  id=model.community_id, scope=CommunityScopeConstants.SendInvite).to_community_json(),
                    EntityScope(user_id=model.creator_id,  id=model.community_id, scope=CommunityScopeConstants.ApproveMembershipRequest).to_community_json(),
                    EntityScope(user_id=model.creator_id,  id=model.community_id, scope=CommunityScopeConstants.CreateResource).to_community_json()
                          ]
                
                self.communitiesBroker.create(model=model, scopes=scopes)
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
    def __init__(self, usersBroker: IUsersBroker, communitiesBroker: ICommunitiesBroker, resourcesBroker: IResourcesBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.communitiesBroker = communitiesBroker
        self.resourcesBroker = resourcesBroker
        
        super().__init__(api, *args, **kwargs)
    
    @communities_ns.doc(description='Retrieve a community',        
        responses={int(HTTPStatus.OK): "Retrieved community.",
                   int(HTTPStatus.NOT_FOUND): "Community id not found."
                  },
        security='CSRF')
    @communities_ns.marshal_with(community_model, mask="*")
    @auth_validator()
    def get(self, id):
        '''Retrieve community details, available to any user'''                
        community = self.communitiesBroker.get_by_id(id)
        
        if community is None:
            abort(HTTPStatus.NOT_FOUND)

        creator = self.usersBroker.get_user_by_id(community.creator_id, load_scopes=False)
        if creator:
            community.creator = creator.user_info
        
        return community
    
    @communities_ns.doc(description='Update community fields',        
        responses={int(HTTPStatus.OK): "Community updated.", 
                   int(HTTPStatus.NOT_FOUND): "Community id not found",
                   int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/manager' required"},
        security='CSRF')
    @communities_ns.expect(update_community_parser)
    @auth_validator()
    def put(self, id):
        '''Update a community, available to community managers'''
        
        identity = get_jwt_identity()
        user_id = identity["user_id"]
        
        #TODO: move scopes to JWT token and validate trough decorator
        #verify scope
        user = self.usersBroker.get_user_by_id(user_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not self.communitiesBroker.community_id_exists(id):
            abort(HTTPStatus.NOT_FOUND)

        if not user.has_any_community_scope(id=id, scopes=[CommunityScopeConstants.Owner, CommunityScopeConstants.Manager]):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")       
        
        community_dict = update_community_parser.parse_args()
        
        try:            
            model = CommunityModel(community_id=id, title=community_dict["title"], description=community_dict["description"], 
                                    membership=None, status=community_dict["status"])
            
            self.communitiesBroker.update(model)
        except:
            app.logger.exception("Community->put")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)   
            
        message = f"Community '{id}' updated."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK
        
        return response
    
    @communities_ns.doc(description='Delete  community entries',
        responses={int(HTTPStatus.OK): "Community deleted.", 
                   int(HTTPStatus.FORBIDDEN): "Insufficient rights, scope 'community/manager' required",
                   int(HTTPStatus.CONFLICT): "There are resources linked to this community"},                   
        security='CSRF')
    @auth_validator()
    def delete(self, id):
        '''Delete community, available to community managers'''
        
        identity = get_jwt_identity()
        user_id = identity["user_id"]
        
        #verify scope
        user = self.usersBroker.get_user_by_id(user_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if not user.has_community_scope(id=id, scope=CommunityScopeConstants.Owner):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        

        #check for any resources
        resources = self.resourcesBroker.get_all_by_community_id(community_id=id)
        if len(resources) > 0:
            abort(HTTPStatus.CONFLICT, "There are resources linked to this community")

        self.communitiesBroker.delete(id)
            
        message = f"All data for community '{id}' deleted."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK
        
        return response