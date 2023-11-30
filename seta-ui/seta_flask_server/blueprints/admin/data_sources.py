from http import HTTPStatus
from injector import inject

from werkzeug.exceptions import BadRequest
from flask import jsonify, current_app
from flask_restx import Namespace, Resource, abort
from flask_jwt_extended import jwt_required, get_jwt_identity

from seta_flask_server.repository import interfaces

from seta_flask_server.infrastructure.dto.payload_errors import PayloadErrors
from seta_flask_server.blueprints.admin.logic import user_logic, data_sources_logic
from .models import data_source_dto as dto

data_sources_ns = Namespace(
    "Data Sources", description="Admin data sources", validate=False
)
data_sources_ns.models.update(dto.ns_models)


@data_sources_ns.route("", endpoint="admin_data_sources", methods=["GET", "POST"])
class DataSourcesResource(Resource):
    """Handles HTTP requests to URL: /admin/data-sources."""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        data_sources_broker: interfaces.IDataSourcesBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.data_sources_broker = data_sources_broker

        super().__init__(api, *args, **kwargs)

    @data_sources_ns.doc(
        description="Get all data sources",
        responses={
            int(HTTPStatus.OK): "Retrieved data sources.",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, role 'Administrator' required",
        },
        security="CSRF",
    )
    @data_sources_ns.marshal_list_with(
        dto.view_data_source_model, mask="*", skip_none=True
    )
    @jwt_required()
    def get(self):
        """
        Retrieve all data sources, available to sysadmin,

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        # verify scope
        user = self.users_broker.get_user_by_id(auth_id)
        if not user_logic.can_approve_resource_cr(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        data_sources = self.data_sources_broker.get_all(active_only=False)
        data_sources_logic.load_data_sources_creators(
            data_sources=data_sources, users_broker=self.users_broker
        )

        return data_sources

    @data_sources_ns.doc(
        description="Create data source.",
        responses={
            int(HTTPStatus.CREATED): "Created data source.",
            int(HTTPStatus.BAD_REQUEST): "Errors in request payload",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
        },
        security="CSRF",
    )
    @data_sources_ns.expect(dto.new_data_source_model)
    @data_sources_ns.response(int(HTTPStatus.CREATED), "", dto.response_message_model)
    @data_sources_ns.response(
        int(HTTPStatus.BAD_REQUEST), "Bad payload", dto.error_model
    )
    @jwt_required()
    def post(self):
        """Create a new data source, available to sysadmins.

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id, load_scopes=False)
        if not user_logic.is_admin(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        try:
            data_source = data_sources_logic.build_new_data_source(
                payload=data_sources_ns.payload,
                broker=self.data_sources_broker,
            )

            self.data_sources_broker.create(data_source)
        except PayloadErrors as pe:
            e = BadRequest()
            e.data = pe.response_data
            raise e  # pylint: disable=raise-missing-from
        except Exception:
            current_app.logger.exception("RollingIndexes->post")
            abort()

        response = jsonify(status="success", message="Data source created.")
        response.status_code = HTTPStatus.CREATED

        return response


@data_sources_ns.route(
    "/<string:data_source_id>", endpoint="admin_data_source", methods=["PUT"]
)
@data_sources_ns.param("data_source_id", "Data source identifier")
@data_sources_ns.response(int(HTTPStatus.BAD_REQUEST), "", dto.error_model)
class DataSourceResource(Resource):
    """Handles HTTP requests to URL: /admin/data-sources/{data_source_id}."""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        data_sources_broker: interfaces.IDataSourcesBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.data_sources_broker = data_sources_broker

        super().__init__(api, *args, **kwargs)

    @data_sources_ns.doc(
        description="Update data source",
        responses={
            int(HTTPStatus.OK): "Data source updated.",
            int(HTTPStatus.BAD_REQUEST): "Errors in request payload",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
            int(HTTPStatus.NOT_FOUND): "Data source not found.",
        },
        security="CSRF",
    )
    @data_sources_ns.response(int(HTTPStatus.OK), "", dto.response_message_model)
    @data_sources_ns.expect(dto.data_source_model)
    @jwt_required()
    def put(self, data_source_id: str):
        """
        Updates a data source, available to sysadmins

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id, load_scopes=False)
        if not user_logic.is_admin(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        data_source = self.data_sources_broker.get_by_id(data_source_id)
        if data_source is None:
            abort(HTTPStatus.NOT_FOUND, message="Data source not found.")

        try:
            update_data_source = data_sources_logic.build_update_data_source(
                broker=self.data_sources_broker,
                payload=data_sources_ns.payload,
                data_source=data_source,
            )

            self.data_sources_broker.update(update_data_source)
        except PayloadErrors as pe:
            e = BadRequest()
            e.data = pe.response_data
            raise e  # pylint: disable=raise-missing-from
        except Exception:
            current_app.logger.exception("DataSourceResource->put")
            abort()

        return jsonify(status="success", message="Data source updated.")
