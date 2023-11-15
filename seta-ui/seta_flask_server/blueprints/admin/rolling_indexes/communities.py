from http import HTTPStatus
from injector import inject

from werkzeug.exceptions import BadRequest

from flask import jsonify, current_app
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Resource, abort

from seta_flask_server.repository import interfaces
from seta_flask_server.infrastructure.dto.payload_errors import PayloadErrors

from seta_flask_server.blueprints.admin.models import rolling_index_dto as dto
from seta_flask_server.blueprints.admin.logic import user_logic, rolling_index_logic

from .ns import rolling_indexes_ns


@rolling_indexes_ns.route(
    "/rolling-indexes/<string:name>/communities",
    endpoint="admin_rolling_index_communities",
    methods=["POST"],
)
@rolling_indexes_ns.param("name", "Rolling index name")
@rolling_indexes_ns.response(
    int(HTTPStatus.BAD_REQUEST), "Bad payload", dto.error_model
)
class RollingIndexCommunities(Resource):
    """Handles HTTP requests to URL: /admin/rolling-indexes/{name}/communities}."""

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
        description="Replace communities list in rolling index",
        responses={
            int(HTTPStatus.OK): "Communities list replaced.",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
            int(HTTPStatus.NOT_FOUND): "Rolling index not found.",
            int(HTTPStatus.BAD_REQUEST): "Errors in request payload",
        },
        security="CSRF",
    )
    @rolling_indexes_ns.response(int(HTTPStatus.OK), "", dto.response_message_model)
    @rolling_indexes_ns.expect(dto.community_list_model)
    @jwt_required()
    def post(self, name: str):
        """
        Replace communities list in rolling index, available to sysadmins

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(user_id, load_scopes=False)
        if not user_logic.is_admin(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not self.rolling_index_broker.name_exists(name):
            abort(HTTPStatus.NOT_FOUND, message="Rolling index not found.")

        community_ids = rolling_indexes_ns.payload["communities"]

        try:
            rolling_index_logic.validate_community_list(
                index_broker=self.rolling_index_broker,
                communities=community_ids,
                rolling_index_name=name,
            )

            self.rolling_index_broker.update_communities(
                rolling_index_name=name, community_ids=community_ids
            )
        except PayloadErrors as pe:
            e = BadRequest()
            e.data = pe.response_data
            raise e  # pylint: disable=raise-missing-from
        except Exception:
            current_app.logger.exception("RollingIndexCommunities->post")
            abort()

        return jsonify(status="success", message="Communities list replaced.")
