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


@data_sources_ns.route("/indexes", endpoint="admin_indexes", methods=["GET", "POST"])
class SearchIndexesResource(Resource):
    """Handles HTTP requests to URL: /admin/data-sources/indexes."""

    @inject
    def __init__(
        self,
        users_broker: interfaces.IUsersBroker,
        search_index_broker: interfaces.ISearchIndexesBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.users_broker = users_broker
        self.search_index_broker = search_index_broker

        super().__init__(api, *args, **kwargs)

    @data_sources_ns.doc(
        description="Get all indexes",
        responses={
            int(HTTPStatus.OK): "Retrieved indexes.",
            int(
                HTTPStatus.FORBIDDEN
            ): "Insufficient rights, role 'Administrator' required",
        },
        security="CSRF",
    )
    @data_sources_ns.marshal_list_with(
        dto.view_search_index_model, mask="*", skip_none=True
    )
    @jwt_required()
    def get(self):
        """
        Retrieve all indexes, available to sysadmin,

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        # verify scope
        user = self.users_broker.get_user_by_id(auth_id)
        if not user_logic.is_admin(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        return self.search_index_broker.get_all()

    @data_sources_ns.doc(
        description="Create index.",
        responses={
            int(HTTPStatus.CREATED): "Created index.",
            int(HTTPStatus.BAD_REQUEST): "Errors in request payload",
            int(HTTPStatus.FORBIDDEN): "Insufficient rights",
        },
        security="CSRF",
    )
    @data_sources_ns.expect(dto.new_search_index_model)
    @data_sources_ns.response(
        int(HTTPStatus.CREATED), "", dto.response_dto.response_message_model
    )
    @data_sources_ns.response(
        int(HTTPStatus.BAD_REQUEST), "Bad payload", dto.response_dto.error_model
    )
    @data_sources_ns.response(
        int(HTTPStatus.CONFLICT),
        "Search engine already contains this index",
        dto.response_dto.error_model,
    )
    @jwt_required()
    def post(self):
        """Create a new index, available to sysadmins.

        Permissions: "Administrator" role
        """

        identity = get_jwt_identity()
        auth_id = identity["user_id"]

        user = self.users_broker.get_user_by_id(auth_id, load_scopes=False)
        if not user_logic.is_admin(user):
            abort(HTTPStatus.FORBIDDEN, "Insufficient rights.")

        try:
            index = data_sources_logic.build_index_model(
                payload=data_sources_ns.payload
            )

            data_sources_logic.create_index_model(
                index=index, broker=self.search_index_broker
            )
        except PayloadErrors as pe:
            e = BadRequest()
            e.data = pe.response_data
            raise e  # pylint: disable=raise-missing-from
        except Exception:
            current_app.logger.exception("SearchIndexesResource->post")
            abort()

        response = jsonify(status="success", message="Index created.")
        response.status_code = HTTPStatus.CREATED

        return response
