from http import HTTPStatus
from injector import inject


from flask import current_app as app
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, abort

from seta_flask_server.infrastructure.clients.private_api_client import (
    PrivateResourcesClient,
)

from seta_flask_server.infrastructure.constants import (
    UserRoleConstants,
    StatsTypeConstants,
)
from seta_flask_server.repository import interfaces
from .models.stats_dto import stats_light_model

stats_ns = Namespace("Stats", validate=True, description="SETA Admin Statistics")
stats_ns.models[stats_light_model.name] = stats_light_model


@stats_ns.route("/light", endpoint="stats_light", methods=["GET"])
class StatsLight(Resource):
    """Handles HTTP requests to URL: /admin/stats/light."""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        stats_broker: interfaces.IStatsBroker,
        *args,
        api=None,
        **kwargs
    ):
        self.users_broker = users_broker
        self.stats_broker = stats_broker

        super().__init__(api, *args, **kwargs)

    @stats_ns.doc(
        description="Retrieve admin light stats for sidebar",
        responses={
            int(HTTPStatus.OK): "'Retrieved stats.",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
        },
        security="CSRF",
    )
    @stats_ns.marshal_list_with(stats_light_model)
    @jwt_required()
    def get(self):
        """Retrieve stats for administration sidebar, available to sysadmins."""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        # verify scope
        user = self.users_broker.get_user_by_id(user_id)
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if user.role.lower() != UserRoleConstants.Admin.lower():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        result = []

        result.append(
            {
                "label": "Community change requests",
                "type": StatsTypeConstants.CommunityChangeRequest,
                "count": self.stats_broker.count_community_change_requests(),
            }
        )

        result.append(
            {
                "label": "Resource change requests",
                "type": StatsTypeConstants.ResourceChangeRequest,
                "count": self.stats_broker.count_resource_change_requests(),
            }
        )

        result.append(
            {
                "label": "Orphaned communities",
                "type": StatsTypeConstants.OrphanedCommunities,
                "count": self.stats_broker.count_community_orphans(),
            }
        )

        count_orphaned_resources = 0

        try:
            client = PrivateResourcesClient()
            codes = client.all()

            if codes is not None and codes:
                count_orphaned_resources = self.stats_broker.count_resource_orphans(
                    codes
                )

        except Exception:
            app.logger.exception("CommunityResourceList->post")

        result.append(
            {
                "label": "Orphaned resources",
                "type": StatsTypeConstants.OrphanedResources,
                "count": count_orphaned_resources,
            }
        )

        return result
