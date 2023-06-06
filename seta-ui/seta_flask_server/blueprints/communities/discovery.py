from datetime import datetime
import pytz

from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restx import Namespace, Resource

from injector import inject
from http import HTTPStatus

from seta_flask_server.repository.interfaces import (ICommunitiesBroker, IResourcesBroker, IMembershipsBroker, 
                                                     ICommunityInvitesBroker, IUsersBroker)
from seta_flask_server.infrastructure.constants import (CommunityStatusConstants, ResourceStatusConstants, 
                        DiscoverCommunityStatus, RequestStatusConstants, InviteStatusConstants)
from .models.invite_dto import invite_model
from .models.membership_dto import request_model
from .models.discovery_dto import(discover_community_model, discover_resource_model)

discovery_ns = Namespace('Discovery', validate=True, description='Discover communities and resources')
discovery_ns.models[invite_model.name] = invite_model
discovery_ns.models[request_model.name] = request_model
discovery_ns.models[discover_community_model.name] = discover_community_model
discovery_ns.models[discover_resource_model.name] = discover_resource_model

@discovery_ns.route('/communities', endpoint="discover_community_list", methods=['GET'])
class DiscoverCommunities(Resource):
    '''Discover communities and resources, accesbile to any user'''
    
    @inject
    def __init__(self, communitiesBroker: ICommunitiesBroker, 
                 membershipsBroker: IMembershipsBroker, 
                 invitesBroker: ICommunityInvitesBroker, 
                 usersBroker: IUsersBroker,
                 api=None, *args, **kwargs):
        self.communitiesBroker = communitiesBroker
        self.membershipsBroker= membershipsBroker
        self.invitesBroker = invitesBroker
        self.usersBroker = usersBroker
        
        super().__init__(api, *args, **kwargs)
        
    @discovery_ns.doc(description='Discover communities',        
        responses={int(HTTPStatus.OK): "'Retrieved community list."},
        security='CSRF')
    @discovery_ns.marshal_list_with(discover_community_model, mask="*", skip_none=True)
    @jwt_required()    
    def get(self):
        '''Discover communities, accesbile to any user'''   
        identity = get_jwt_identity()
        user_id = identity["user_id"]
        now = datetime.now(tz=pytz.utc)
        
        communities = filter(lambda community: community.status == CommunityStatusConstants.Active, self.communitiesBroker.get_all())

        discoveries = []

        # get user memberships
        memberships = self.membershipsBroker.get_memberships_by_user_id(user_id)
        
        #get user requests
        requests = filter(lambda req: req.status == RequestStatusConstants.Pending or req.status ==  RequestStatusConstants.Rejected,
                          self.membershipsBroker.get_requests_by_user_id(user_id))
        
        #get pending invites
        invites = filter(lambda inv: inv.expire_date.replace(tzinfo=pytz.utc) > now,
                         self.invitesBroker.get_all_by_status_and_invited_user_id(user_id=user_id, status=InviteStatusConstants.Pending))

        for community in communities:
            discover = {"community_id": community.community_id, 
                        "title": community.title, 
                        "description": community.description,
                        "membership": community.membership,
                        "created_at": community.created_at,
                        "status": DiscoverCommunityStatus.Unknown
                        }
            discoveries.append(discover)
            
            membership = next((m for m in memberships if m.community_id == community.community_id), None)

            if membership:
                discover["status"] = DiscoverCommunityStatus.Member
                continue

            invite = next((i for i in invites if i.community_id == community.community_id), None)
            if invite:
                initiator = self.usersBroker.get_user_by_id(user_id=invite.initiated_by, load_scopes=False)
                
                discover["status"] = DiscoverCommunityStatus.Invited
                discover["pending_invite"] = {
                    "invite_id": invite.invite_id,
                    "message": invite.message,
                    "expire_date": invite.expire_date,
                    "initiated_by": "unknown",
                    "initiated_date": invite.initiated_date
                }

                if initiator:
                    discover["pending_invite"]["initiated_by"] = initiator.email
                continue
            
            request = next((r for r in requests if r.community_id == community.community_id), None)
            if request:
                discover["membership_request"] = {
                    "message": request.message,
                    "initiated_date": request.initiated_date,
                    "status": request.status
                }

                if request.status == RequestStatusConstants.Pending:
                    discover["status"] = DiscoverCommunityStatus.Pending
                else:
                    discover["status"] = DiscoverCommunityStatus.Rejected                    

                    if request.reviewed_by:
                        reviewer = self.usersBroker.get_user_by_id(request.reviewed_by)
                        if reviewer:
                             discover["membership_request"]["reviewed_by"] = reviewer.email
                             discover["membership_request"]["review_date"] = request.review_date
                             discover["membership_request"]["reject_timeout"] = request.reject_timeout

                

        return discoveries
    
@discovery_ns.route('/resources', endpoint="discover_resource_list", methods=['GET'])
class DiscoverResources(Resource):
    '''Get all resources'''
    
    @inject
    def __init__(self, resourcesBroker: IResourcesBroker, communitiesBroker: ICommunitiesBroker, api=None, *args, **kwargs):
        self.communitiesBroker = communitiesBroker
        self.resourcesBroker = resourcesBroker
        
        super().__init__(api, *args, **kwargs)
        
    @discovery_ns.doc(description='Discover resources.',        
        responses={int(HTTPStatus.OK): "'Retrieved resource list."},
        security='CSRF')
    @discovery_ns.marshal_list_with(discover_resource_model, mask="*")
    @jwt_required()    
    def get(self):
        '''Discover resources, accesible to any user'''
        identity = get_jwt_identity()
        user_id = identity["user_id"]

        queryables = self.resourcesBroker.get_all_queryable_by_user_id(user_id)
        communities = self.communitiesBroker.get_all()
        
        discoveries = []
        resources = filter(lambda resource: resource.status == ResourceStatusConstants.Active, self.resourcesBroker.get_all())

        for resource in resources:
            community = next((c for c in communities if c.community_id == resource.community_id), None)
            if community.status == CommunityStatusConstants.Blocked:
                continue

            discover = {
                "resource_id": resource.resource_id,
                "community_id": resource.community_id,
                "community_title": community.title,
                "title": resource.title,
                "abstract": resource.abstract,                
                "created_at": resource.created_at
            }
            discover["searchable"] = any(q.resource_id == resource.resource_id for q in queryables)

            discoveries.append(discover)

        return discoveries