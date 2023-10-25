from http import HTTPStatus
from datetime import datetime
from injector import inject
import pytz

from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restx import Namespace, Resource

from seta_flask_server.repository import interfaces
from seta_flask_server.infrastructure import constants

from .models.invite_dto import invite_model
from .models.membership_dto import request_model
from .models.discovery_dto import discover_community_model, discover_resource_model

discovery_ns = Namespace(
    "Discovery", validate=True, description="Discover communities and resources"
)
discovery_ns.models[invite_model.name] = invite_model
discovery_ns.models[request_model.name] = request_model
discovery_ns.models[discover_community_model.name] = discover_community_model
discovery_ns.models[discover_resource_model.name] = discover_resource_model


@discovery_ns.route("/communities", endpoint="discover_community_list", methods=["GET"])
class DiscoverCommunities(Resource):
    """Discover communities and resources, available to any user"""

    @inject
    def __init__(
        self,
        communities_broker: interfaces.ICommunitiesBroker,
        memberships_broker: interfaces.IMembershipsBroker,
        invites_broker: interfaces.ICommunityInvitesBroker,
        users_broker: interfaces.IUsersBroker,
        *args,
        api=None,
        **kwargs
    ):
        self.communities_broker = communities_broker
        self.memberships_broker = memberships_broker
        self.invites_broker = invites_broker
        self.users_broker = users_broker

        super().__init__(api, *args, **kwargs)

    @discovery_ns.doc(
        description="Discover communities",
        responses={int(HTTPStatus.OK): "'Retrieved community list."},
        security="CSRF",
    )
    @discovery_ns.marshal_list_with(discover_community_model, mask="*", skip_none=True)
    @jwt_required()
    def get(self):
        """Discover communities, available to any user"""
        identity = get_jwt_identity()
        user_id = identity["user_id"]
        now = datetime.now(tz=pytz.utc)

        communities = filter(
            lambda community: community.status
            == constants.CommunityStatusConstants.Active,
            self.communities_broker.get_all(),
        )
        # get user memberships
        memberships = self.memberships_broker.get_memberships_by_user_id(user_id)

        # get user requests
        result = self.memberships_broker.get_requests_by_user_id(user_id)
        requests = list(
            filter(
                lambda req: req.status
                in (
                    constants.RequestStatusConstants.Pending,
                    constants.RequestStatusConstants.Rejected,
                ),
                result,
            )
        )

        pending_invites = list(
            filter(
                lambda inv: inv.expire_date.replace(tzinfo=pytz.utc) > now,
                self.invites_broker.get_all_by_status_and_invited_user_id(
                    user_id=user_id, status=constants.InviteStatusConstants.Pending
                ),
            )
        )

        #! Move this logic to another module
        discoveries = []

        for community in communities:
            discover = {
                "community_id": community.community_id,
                "title": community.title,
                "description": community.description,
                "membership": community.membership,
                "created_at": community.created_at,
                "status": constants.DiscoverCommunityStatus.Unknown,
            }
            discoveries.append(discover)

            membership = next(
                (m for m in memberships if m.community_id == community.community_id),
                None,
            )

            if membership:
                discover["status"] = constants.DiscoverCommunityStatus.Member
                continue

            invite = next(
                (
                    pi
                    for pi in pending_invites
                    if pi.community_id == community.community_id
                ),
                None,
            )
            if invite:
                discover["status"] = constants.DiscoverCommunityStatus.Invited
                discover["pending_invite"] = {
                    "invite_id": invite.invite_id,
                    "community_id": community.community_id,
                    "message": invite.message,
                    "status": invite.status,
                    "expire_date": invite.expire_date,
                    "initiated_by": invite.initiated_by,
                    "initiated_date": invite.initiated_date,
                }

                initiator = self.users_broker.get_user_by_id(
                    user_id=invite.initiated_by, load_scopes=False
                )
                if initiator:
                    discover["pending_invite"][
                        "initiated_by_info"
                    ] = initiator.user_info.to_json()

                continue

            request = next(
                (r for r in requests if r.community_id == community.community_id), None
            )
            if request:
                discover["membership_request"] = {
                    "community_id": community.community_id,
                    "message": request.message,
                    "initiated_date": request.initiated_date,
                    "status": request.status,
                }

                if request.status == constants.RequestStatusConstants.Pending:
                    discover["status"] = constants.DiscoverCommunityStatus.Pending
                else:
                    discover["status"] = constants.DiscoverCommunityStatus.Rejected

                    if request.reviewed_by:
                        reviewer = self.users_broker.get_user_by_id(request.reviewed_by)
                        if reviewer:
                            discover["membership_request"][
                                "reviewed_by"
                            ] = request.reviewed_by
                            discover["membership_request"][
                                "reviewed_by_info"
                            ] = reviewer.user_info.to_json()
                            discover["membership_request"][
                                "review_date"
                            ] = request.review_date
                            discover["membership_request"][
                                "reject_timeout"
                            ] = request.reject_timeout

        return discoveries


@discovery_ns.route("/resources", endpoint="discover_resource_list", methods=["GET"])
class DiscoverResources(Resource):
    """Get all resources"""

    @inject
    def __init__(
        self,
        resources_broker: interfaces.IResourcesBroker,
        communities_broker: interfaces.ICommunitiesBroker,
        *args,
        api=None,
        **kwargs
    ):
        self.communities_broker = communities_broker
        self.resources_broker = resources_broker

        super().__init__(api, *args, **kwargs)

    @discovery_ns.doc(
        description="Discover resources.",
        responses={int(HTTPStatus.OK): "'Retrieved resource list."},
        security="CSRF",
    )
    @discovery_ns.marshal_list_with(discover_resource_model, mask="*", skip_none=True)
    @jwt_required()
    def get(self):
        """Discover resources, available to any user"""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        queryables = self.resources_broker.get_all_queryable_by_user_id(user_id)
        communities = self.communities_broker.get_all()

        discoveries = []
        resources = filter(
            lambda resource: resource.status
            == constants.ResourceStatusConstants.Active,
            self.resources_broker.get_all(),
        )

        for resource in resources:
            community = next(
                (c for c in communities if c.community_id == resource.community_id),
                None,
            )
            if community.status == constants.CommunityStatusConstants.Blocked:
                continue

            discover = {
                "resource_id": resource.resource_id,
                "community_id": resource.community_id,
                "community_title": community.title,
                "title": resource.title,
                "abstract": resource.abstract,
                "created_at": resource.created_at,
            }
            discover["searchable"] = any(
                q.resource_id == resource.resource_id for q in queryables
            )

            discoveries.append(discover)

        return discoveries
