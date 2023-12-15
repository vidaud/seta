from http import HTTPStatus

from requests import HTTPError
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


@data_sources_ns.route("", endpoint="admin_data_sources", methods=["GET", "POST"])
class DataSourcesResource(Resource):
    """Handles HTTP requests to URL: /admin/data-sources."""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        data_sources_broker: interfaces.IDataSourcesBroker,
        search_index_broker: interfaces.ISearchIndexesBroker,
        data_source_scopes_broker: interfaces.IDataSourceScopesBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.data_sources_broker = data_sources_broker
        self.search_index_broker = search_index_broker
        self.data_source_scopes_broker = data_source_scopes_broker

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
        if not user_logic.is_admin(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        data_sources = self.data_sources_broker.get_all(active_only=False)
        data_sources_logic.load_data_sources_creators(
            data_sources=data_sources, users_broker=self.users_broker
        )

        data_sources_logic.load_data_sources_scopes(
            data_sources=data_sources,
            scopes_broker=self.data_source_scopes_broker,
            users_broker=self.users_broker,
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
    @data_sources_ns.response(
        int(HTTPStatus.CREATED), "", dto.response_dto.response_message_model
    )
    @data_sources_ns.response(
        int(HTTPStatus.BAD_REQUEST), "Bad payload", dto.response_dto.error_model
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
            data_source.creator_id = auth_id

            data_sources_logic.create_index_model(
                index=data_source.search_index,
                broker=self.search_index_broker,
                ignore_exists=True,
            )

            self.data_sources_broker.create(data_source)
        except PayloadErrors as pe:
            e = BadRequest()
            e.data = pe.response_data
            raise e  # pylint: disable=raise-missing-from
        except HTTPError as e:
            if e.response.status_code == int(HTTPStatus.CONFLICT):
                current_app.logger.info(
                    "The index '%s' already exists in Search engine.",
                    data_source.index_name,
                )
            else:
                current_app.logger.debug(str(e))
                abort(
                    code=HTTPStatus(e.response.status_code),
                    message="Error on search index creation.",
                )
        except Exception:
            current_app.logger.exception("DataSourcesResource->post")
            abort()

        response = jsonify(status="success", message="Data source created.")
        response.status_code = HTTPStatus.CREATED

        return response
