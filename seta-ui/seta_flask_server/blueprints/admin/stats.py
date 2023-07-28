from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, abort
from flask import current_app as app, jsonify

from injector import inject
from http import HTTPStatus
from werkzeug.exceptions import HTTPException

from seta_flask_server.infrastructure.clients.private_api_client import PrivateResourcesClient

from seta_flask_server.infrastructure.constants import UserRoleConstants, StatsTypeConstants
from seta_flask_server.repository.interfaces import (IUsersBroker, IStatsBroker)
from .models.stats_dto import stats_light_model

stats_ns = Namespace('Stats', validate=True, description='SETA Admin Statistics')
stats_ns.models[stats_light_model.name] = stats_light_model


@stats_ns.route("/light", endpoint="stats_light", methods=['GET'])
class StatsLight(Resource):

    """Handles HTTP requests to URL: /admin/stats/light."""

    @inject
    def __init__(self, usersBroker: IUsersBroker, statsBroker: IStatsBroker, api=None, *args, **kwargs):
        self.usersBroker = usersBroker
        self.statsBroker = statsBroker
        
        super().__init__(api, *args, **kwargs)

    @stats_ns.doc(description='Retrieve admin light stats for sidebar',
        responses={
                    int(HTTPStatus.OK): "'Retrieved stats.",
                    int(HTTPStatus.FORBIDDEN): "Insufficient rights"
                },
        
        security='CSRF')
    @stats_ns.marshal_list_with(stats_light_model)
    @jwt_required()
    def get(self):
        '''
        Retrieve stats for administation sidebar, available to sysadmins
        '''
        
        identity = get_jwt_identity()
        user_id = identity["user_id"]
        
        #verify scope
        user = self.usersBroker.get_user_by_id(user_id)        
        if user is None or user.is_not_active():
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if user.role.lower() != UserRoleConstants.Admin.lower():        
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        result = []

        result.append({
            "label": "Community change requests",
            "type": StatsTypeConstants.CommunityChangeRequest,
            "count": self.statsBroker.count_community_change_requests()
        })

        result.append({
            "label": "Resource change requests",
            "type": StatsTypeConstants.ResourceChangeRequest,
            "count": self.statsBroker.count_resource_change_requests()
        })

        result.append({
            "label": "Orphaned communities",
            "type": StatsTypeConstants.OrphanedCommunities,
            "count": self.statsBroker.count_community_orphans()
        })

        count_orphaned_resources = 0

        try:
            client = PrivateResourcesClient()
            codes = client.all()

            if codes is not None and len(codes) > 0:
                count_orphaned_resources = self.statsBroker.count_resource_orphans(codes)

        except:
            app.logger.exception("CommunityResourceList->post")

        result.append({
            "label": "Orphaned resources",
            "type": StatsTypeConstants.OrphanedResources,
            "count": count_orphaned_resources
        })
        
        return result