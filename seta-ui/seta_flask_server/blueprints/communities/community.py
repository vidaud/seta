from http import HTTPStatus
from injector import inject

from flask import current_app as app, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, abort

from seta_flask_server.repository.models import CommunityModel, EntityScope
from seta_flask_server.repository import interfaces

from seta_flask_server.infrastructure.scope_constants import (
    CommunityScopeConstants,
    SystemScopeConstants,
)
from seta_flask_server.infrastructure.constants import (
    CommunityMembershipConstants,
    CommunityStatusConstants,
)

from .models import community_dto as dto

communities_ns = Namespace("Communities", validate=True, description="SETA Communities")
communities_ns.models.update(dto.ns_community_models)


@communities_ns.route("/", endpoint="community_list", methods=["GET", "POST"])
class CommunityList(Resource):
    """Get a list of communities with this authorized user membership and expose POST for new communities"""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        communities_broker: interfaces.ICommunitiesBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.communities_broker = communities_broker

        super().__init__(api, *args, **kwargs)

    @communities_ns.doc(
        description="Retrieve membership communities for the authenticated user.",
        responses={int(HTTPStatus.OK): "'Retrieved community list."},
        security="CSRF",
    )
    @communities_ns.marshal_list_with(dto.community_model, mask="*", skip_none=True)
    @jwt_required()
    def get(self):
        """Retrieve the communities where this authenticated user is a member, available for any user"""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        communities = self.communities_broker.get_all_by_user_id(user_id)

        for community in communities:
            creator = self.users_broker.get_user_by_id(
                community.creator_id, load_scopes=False
            )
            if creator:
                community.creator = creator.user_info

        return communities

    @communities_ns.doc(
        description="Create a new community and add this user as a member with elevated scopes.",
        responses={
            int(HTTPStatus.CREATED): "Added new community.",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, scope '/seta/community/create' required",
            int(HTTPStatus.CONFLICT): "Community already exists.",
        },
        security="CSRF",
    )
    @communities_ns.expect(dto.new_community_parser)
    @jwt_required()
    def post(self):
        """
        Create a community, available for users with '/seta/community/create' scope.

        Any new user added to the system have the '/seta/community/create' scope, but it can be revoked by the sysadmin.
        """

        identity = get_jwt_identity()
        user_id = identity["user_id"]
        id_exists = False

        # verify scope
        user = self.users_broker.get_user_by_id(user_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not user.has_system_scope(scope=SystemScopeConstants.CreateCommunity):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        community_dict = dto.new_community_parser.parse_args()

        try:
            community_id = community_dict["community_id"]
            id_exists = self.communities_broker.community_id_exists(community_id)

            if not id_exists:
                model = CommunityModel(
                    community_id=community_id,
                    title=community_dict["title"],
                    description=community_dict["description"],
                    membership=CommunityMembershipConstants.Closed,
                    status=CommunityStatusConstants.Active,
                    creator_id=identity["user_id"],
                )

                scopes = [
                    EntityScope(
                        user_id=model.creator_id,
                        id=model.community_id,
                        scope=CommunityScopeConstants.Owner,
                    ).to_community_json(),
                    EntityScope(
                        user_id=model.creator_id,
                        id=model.community_id,
                        scope=CommunityScopeConstants.Manager,
                    ).to_community_json(),
                    EntityScope(
                        user_id=model.creator_id,
                        id=model.community_id,
                        scope=CommunityScopeConstants.SendInvite,
                    ).to_community_json(),
                    EntityScope(
                        user_id=model.creator_id,
                        id=model.community_id,
                        scope=CommunityScopeConstants.ApproveMembershipRequest,
                    ).to_community_json(),
                    EntityScope(
                        user_id=model.creator_id,
                        id=model.community_id,
                        scope=CommunityScopeConstants.CreateResource,
                    ).to_community_json(),
                ]

                self.communities_broker.create(model=model, scopes=scopes)
        except Exception:
            app.logger.exception("CommunityList->post")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)

        if id_exists:
            error = f"Community id '{community_id}' already exists, must be unique."
            abort(HTTPStatus.CONFLICT, error, status="fail")

        response = jsonify(status="success", message="New community added")
        response.status_code = HTTPStatus.CREATED

        return response


@communities_ns.route(
    "/<string:community_id>", endpoint="community", methods=["GET", "PUT", "DELETE"]
)
@communities_ns.param("community_id", "Community id")
class Community(Resource):
    """Handles HTTP requests to URL: /communities/{id}."""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        communities_broker: interfaces.ICommunitiesBroker,
        resources_broker: interfaces.IResourcesBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.communities_broker = communities_broker
        self.resources_broker = resources_broker

        super().__init__(api, *args, **kwargs)

    @communities_ns.doc(
        description="Retrieve a community",
        responses={
            int(HTTPStatus.OK): "Retrieved community.",
            int(HTTPStatus.NOT_FOUND): "Community id not found.",
        },
        security="CSRF",
    )
    @communities_ns.marshal_with(dto.community_model, mask="*")
    @jwt_required()
    def get(self, community_id: str):
        """Retrieve community details, available to any user"""
        community = self.communities_broker.get_by_id(community_id)

        if community is None:
            abort(HTTPStatus.NOT_FOUND)

        creator = self.users_broker.get_user_by_id(
            community.creator_id, load_scopes=False
        )
        if creator:
            community.creator = creator.user_info

        return community

    @communities_ns.doc(
        description="Update community fields",
        responses={
            int(HTTPStatus.OK): "Community updated.",
            int(HTTPStatus.NOT_FOUND): "Community id not found",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, scope 'community/manager' required",
        },
        security="CSRF",
    )
    @communities_ns.expect(dto.update_community_parser)
    @jwt_required()
    def put(self, community_id: str):
        """
        Update a community, available to community managers.

        Permission scopes: either '/seta/community/owner' or '/seta/community/manager'
        """

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        # verify scope
        user = self.users_broker.get_user_by_id(user_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not self.communities_broker.community_id_exists(community_id):
            abort(HTTPStatus.NOT_FOUND)

        if not user.has_any_community_scope(
            community_id=community_id,
            scopes=[CommunityScopeConstants.Owner, CommunityScopeConstants.Manager],
        ):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        community_dict = dto.update_community_parser.parse_args()

        try:
            model = CommunityModel(
                community_id=community_id,
                title=community_dict["title"],
                description=community_dict["description"],
                membership=None,
                status=community_dict["status"],
            )

            self.communities_broker.update(model)
        except Exception:
            app.logger.exception("Community->put")
            abort(HTTPStatus.INTERNAL_SERVER_ERROR)

        message = f"Community '{community_id}' updated."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK

        return response

    @communities_ns.doc(
        description="Delete  community entries",
        responses={
            int(HTTPStatus.OK): "Community deleted.",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, scope 'community/manager' required",
            int(HTTPStatus.CONFLICT): "There are resources linked to this community",
        },
        security="CSRF",
    )
    @jwt_required()
    def delete(self, community_id: str):
        """
        Delete community, available to community managers

        Permission scope: '/seta/community/owner'
        """

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        # verify scope
        user = self.users_broker.get_user_by_id(user_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")
        if not user.has_community_scope(
            community_id=community_id, scope=CommunityScopeConstants.Owner
        ):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        # check for any resources
        resources = self.resources_broker.get_all_by_community_id(
            community_id=community_id
        )
        if resources:
            abort(HTTPStatus.CONFLICT, "There are resources linked to this community")

        self.communities_broker.delete(community_id)

        message = f"All data for community '{community_id}' deleted."
        response = jsonify(status="success", message=message)
        response.status_code = HTTPStatus.OK

        return response
