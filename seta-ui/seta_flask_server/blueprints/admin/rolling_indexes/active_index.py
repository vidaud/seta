from http import HTTPStatus
from injector import inject

from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Resource, abort

from seta_flask_server.repository import interfaces

from seta_flask_server.blueprints.admin.models import rolling_index_dto as dto
from seta_flask_server.blueprints.admin.logic import user_logic

from .ns import rolling_indexes_ns


@rolling_indexes_ns.route(
    "/rolling-indexes/<string:name>/active-index",
    endpoint="admin_rolling_active_index",
    methods=["POST"],
)
@rolling_indexes_ns.param("name", "Rolling index name")
class RollingActiveIndex(Resource):
    """Handles HTTP requests to URL: /admin/rolling-indexes/{name}/active-index}."""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        rolling_index_broker: interfaces.IRollingIndexBroker,
        *args,
        api=None,
        **kwargs,
    ):
        super().__init__(api, *args, **kwargs)

        self.users_broker = users_broker
        self.rolling_index_broker = rolling_index_broker

    @rolling_indexes_ns.doc(
        description="Create new active index",
        responses={
            int(HTTPStatus.CREATED): "New active index created.",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
            int(HTTPStatus.NOT_FOUND): "Rolling index not found.",
        },
        security="CSRF",
    )
    @rolling_indexes_ns.response(
        int(HTTPStatus.CREATED), "", dto.response_message_model
    )
    @jwt_required()
    def post(self, name: str):
        """
        Creates new active index for the specified rolling index, available to sysadmins

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(user_id, load_scopes=False)
        if not user_logic.is_admin(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not self.rolling_index_broker.name_exists(name):
            abort(HTTPStatus.NOT_FOUND, message="Rolling index not found.")

        self.rolling_index_broker.create_active_index(rolling_index_name=name)

        response = jsonify(status="success", message="Active index created.")
        response.status_code = HTTPStatus.CREATED

        return response
