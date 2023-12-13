from http import HTTPStatus

from injector import inject

from werkzeug.exceptions import BadRequest
from flask import jsonify, current_app
from flask_restx import Resource, abort
from flask_jwt_extended import jwt_required, get_jwt_identity

from seta_flask_server.repository import interfaces

from seta_flask_server.infrastructure.dto.payload_errors import PayloadErrors
from seta_flask_server.blueprints.admin.logic import user_logic, data_sources_logic
from seta_flask_server.blueprints.admin.models import data_source_dto as dto

from .ns import data_sources_ns


@data_sources_ns.route(
    "/<string:data_source_id>", endpoint="admin_data_source", methods=["PUT"]
)
@data_sources_ns.param("data_source_id", "Data source identifier")
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
    @data_sources_ns.response(
        int(HTTPStatus.OK), "", dto.response_dto.response_message_model
    )
    @data_sources_ns.response(
        int(HTTPStatus.BAD_REQUEST), "", dto.response_dto.error_model
    )
    @data_sources_ns.expect(dto.update_data_source_model)
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


@data_sources_ns.route(
    "/<string:data_source_id>/scopes",
    endpoint="admin_data_source_scopes",
    methods=["POST"],
)
@data_sources_ns.param("data_source_id", "Data source identifier")
class DataSourceScopesResource(Resource):
    """Handles HTTP requests to URL: /admin/data-sources/{data_source_id}/scopes."""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        data_sources_broker: interfaces.IDataSourcesBroker,
        data_source_scopes_broker: interfaces.IDataSourceScopesBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.data_sources_broker = data_sources_broker
        self.data_source_scopes_broker = data_source_scopes_broker

        super().__init__(api, *args, **kwargs)

    @data_sources_ns.doc(
        description="Set data source scopes",
        responses={
            int(HTTPStatus.OK): "Data source scopes set.",
            int(HTTPStatus.BAD_REQUEST): "Errors in request payload",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
            int(HTTPStatus.NOT_FOUND): "Data source not found.",
        },
        security="CSRF",
    )
    @data_sources_ns.response(
        int(HTTPStatus.OK), "", dto.response_dto.response_message_model
    )
    @data_sources_ns.response(
        int(HTTPStatus.BAD_REQUEST), "", dto.response_dto.error_model
    )
    @data_sources_ns.expect(dto.replace_data_source_scopes_model)
    @jwt_required()
    def post(self, data_source_id: str):
        """
        Set scopes for a data source, available to sysadmins

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id, load_scopes=False)
        if not user_logic.is_admin(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        if not self.data_sources_broker.identifier_exists(
            data_source_id=data_source_id
        ):
            abort(HTTPStatus.NOT_FOUND, message="Data source not found.")

        try:
            scopes = data_sources_logic.build_data_source_scopes(
                data_source_id=data_source_id, payload=data_sources_ns.payload
            )

            self.data_source_scopes_broker.replace_for_data_source(
                data_source_id=data_source_id, scopes=scopes
            )
        except PayloadErrors as pe:
            e = BadRequest()
            e.data = pe.response_data
            raise e  # pylint: disable=raise-missing-from
        except Exception:
            current_app.logger.exception("DataSourcesResource->post")
            abort()

        return jsonify(status="success", message="Data source scopes set.")
