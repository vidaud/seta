from http import HTTPStatus
from injector import inject

from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, abort


from seta_flask_server.infrastructure.constants import UserRoleConstants

from seta_flask_server.repository import interfaces
from .models.stats_dto import stats_light_model

stats_ns = Namespace("Stats", validate=True, description="SETA Admin Statistics")
stats_ns.models[stats_light_model.name] = stats_light_model


@stats_ns.route("/light", endpoint="stats_light", methods=["GET"])
class StatsLight(Resource):
    """Handles HTTP requests to URL: /admin/stats/light."""

    @inject
    def __init__(
        self, users_broker: interfaces.IUsersBroker, *args, api=None, **kwargs
    ):
        self.users_broker = users_broker

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

        return result
