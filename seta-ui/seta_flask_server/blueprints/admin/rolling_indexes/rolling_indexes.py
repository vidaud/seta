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
    "/rolling-indexes", endpoint="admin_rolling_indexes", methods=["GET", "POST"]
)
@rolling_indexes_ns.response(
    int(HTTPStatus.BAD_REQUEST), "Bad payload", dto.error_model
)
class RollingIndexes(Resource):
    """Handles HTTP requests to URL: /admin/rolling-indexes."""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        communities_broker: interfaces.ICommunitiesBroker,
        rolling_index_broker: interfaces.IRollingIndexBroker,
        *args,
        api=None,
        **kwargs,
    ):
        super().__init__(api, *args, **kwargs)

        self.users_broker = users_broker
        self.communities_broker = communities_broker
        self.rolling_index_broker = rolling_index_broker

    @rolling_indexes_ns.doc(
        description="Retrieve all rolling indexes",
        responses={
            int(HTTPStatus.OK): "Retrieved rolling indexes.",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, role 'Administrator' required",
        },
        security="CSRF",
    )
    @rolling_indexes_ns.marshal_list_with(dto.rolling_index_model, skip_none=True)
    @jwt_required()
    def get(self):
        """
        Retrieve all rolling indexes, available to sysadmins

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(user_id, load_scopes=False)
        if not user_logic.is_admin(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        return rolling_index_logic.build_rolling_indexes(
            index_broker=self.rolling_index_broker,
            communities_broker=self.communities_broker,
        )

    @rolling_indexes_ns.doc(
        description="Create rolling index.",
        responses={
            int(HTTPStatus.CREATED): "Created rolling index.",
            int(HTTPStatus.BAD_REQUEST): "Errors in request payload",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
        },
        security="CSRF",
    )
    @rolling_indexes_ns.expect(dto.new_rolling_index_model, validate=True)
    @rolling_indexes_ns.response(
        int(HTTPStatus.CREATED), "", dto.response_message_model
    )
    @jwt_required()
    def post(self):
        """Create a new rolling index, available to sysadmins.

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(user_id, load_scopes=False)
        if not user_logic.is_admin(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        try:
            rolling_index = rolling_index_logic.build_new_rolling_index(
                payload=rolling_indexes_ns.payload,
                index_broker=self.rolling_index_broker,
            )

            self.rolling_index_broker.create(rolling_index)
        except PayloadErrors as pe:
            e = BadRequest()
            e.data = pe.response_data
            raise e  # pylint: disable=raise-missing-from
        except Exception:
            current_app.logger.exception("RollingIndexes->post")
            abort()

        response = jsonify(status="success", message="Rolling index created.")
        response.status_code = HTTPStatus.CREATED

        return response
