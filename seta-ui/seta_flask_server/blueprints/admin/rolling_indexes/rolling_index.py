from http import HTTPStatus
from injector import inject

from werkzeug.exceptions import BadRequest

from flask import jsonify, current_app
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Resource, abort

from seta_flask_server.repository import interfaces
from seta_flask_server.infrastructure.dto.payload_errors import PayloadErrors

from seta_flask_server.blueprints.admin.models import rolling_index_dto as dto
from seta_flask_server.blueprints.admin.logic import rolling_index_logic, user_logic

from .ns import rolling_indexes_ns


@rolling_indexes_ns.route(
    "/rolling-indexes/<string:name>",
    endpoint="admin_rolling_index",
    methods=["PUT"],
)
@rolling_indexes_ns.param("name", "Rolling index name")
@rolling_indexes_ns.response(int(HTTPStatus.BAD_REQUEST), "", dto.error_model)
class RollingIndex(Resource):
    """Handles HTTP requests to URL: /admin/rolling-indexes/{name}."""

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
        description="Update rolling index",
        responses={
            int(HTTPStatus.OK): "Rolling index updated.",
            int(HTTPStatus.BAD_REQUEST): "Errors in request payload",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
            int(HTTPStatus.NOT_FOUND): "Rolling index not found.",
        },
        security="CSRF",
    )
    @rolling_indexes_ns.response(int(HTTPStatus.OK), "", dto.response_message_model)
    @rolling_indexes_ns.expect(dto.update_rolling_index_model)
    @jwt_required()
    def put(self, name: str):
        """
        Update a rolling index, available to sysadmins

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(user_id, load_scopes=False)
        if not user_logic.is_admin(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not self.rolling_index_broker.name_exists(name):
            abort(HTTPStatus.NOT_FOUND, message="Rolling index not found.")

        try:
            rolling_index = rolling_index_logic.build_update_rolling_index(
                rolling_index_name=name,
                payload=rolling_indexes_ns.payload,
                index_broker=self.rolling_index_broker,
            )

            self.rolling_index_broker.update(rolling_index)
        except PayloadErrors as pe:
            e = BadRequest()
            e.data = pe.response_data
            raise e  # pylint: disable=raise-missing-from
        except Exception:
            current_app.logger.exception("RollingIndexes->put")
            abort()

        return jsonify(status="success", message="Rolling index updated.")
