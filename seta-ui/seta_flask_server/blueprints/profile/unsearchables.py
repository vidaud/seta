from http import HTTPStatus
from datetime import datetime
import pytz
from injector import inject

from werkzeug.exceptions import BadRequest

from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource

from seta_flask_server.repository import interfaces
from seta_flask_server.repository import models

from .models import unsearchables_dto as dto

unsearchables_ns = Namespace(
    "Unsearchables data sources", description="Profile unsearchable data sources"
)
unsearchables_ns.models.update(dto.ns_models)


@unsearchables_ns.route(
    "/unsearchables", endpoint="me_unsearchables", methods=["GET", "POST"]
)
class UnsearchablesResource(Resource):
    """Handles HTTP requests to URL: /me/unsearchables."""

    @inject
    def __init__(
        self,
        profile_broker: interfaces.IUserProfileUnsearchables,
        data_sources_broker: interfaces.IDataSourcesBroker,
        *args,
        api=None,
        **kwargs,
    ):
        self.profile_broker = profile_broker
        self.data_sources_broker = data_sources_broker

        super().__init__(api, *args, **kwargs)

    @unsearchables_ns.doc(
        description="Retrieve restricted data sources for this user.",
        responses={int(HTTPStatus.OK): "'Retrieved restricted data sources."},
        security="CSRF",
    )
    @unsearchables_ns.marshal_list_with(dto.data_source_model, mask="*", skip_none=True)
    @jwt_required()
    def get(self):
        """Retrieve restricted data sources for the authenticated user"""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        ids = self.profile_broker.get_unsearchables(user_id)

        if not ids:
            return None

        unsearchables = []

        for data_source_id in ids:
            data_source = self.data_sources_broker.get_by_id(
                data_source_id=data_source_id
            )

            if data_source is None:
                unsearchables.append(
                    {
                        "data_source_id": data_source_id,
                        "title": data_source_id,
                    }
                )
            else:
                unsearchables.append(
                    {"data_source_id": data_source_id, "title": data_source.title}
                )

        return unsearchables

    @unsearchables_ns.doc(
        description="Manage restricted data sources for the authenticated user.",
        responses={
            int(HTTPStatus.OK): "Restricted data sources updated.",
            int(HTTPStatus.BAD_REQUEST): "Errors in request payload",
        },
        security="CSRF",
    )
    @unsearchables_ns.expect(dto.update_model)
    @unsearchables_ns.response(
        int(HTTPStatus.OK), "", dto.response_dto.response_message_model
    )
    @unsearchables_ns.response(
        int(HTTPStatus.BAD_REQUEST), "", dto.response_dto.error_model
    )
    @jwt_required()
    def post(self):
        """
        Manage restricted data sources for the authenticated user.
        Send empty array for deletion.
        """

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        request_dict = unsearchables_ns.payload
        if "dataSourceIds" in request_dict:
            data_source_ids = request_dict["dataSourceIds"]
        else:
            e = BadRequest()
            e.data = {
                "message": "Field 'dataSourceIds' is missing from request payload.",
                "errors": {"dataSourceIds": "Field is missing."},
            }
            raise e

        if not data_source_ids:
            self.profile_broker.delete_unsearchables(user_id)
            message = "Restricted list deleted"
        else:
            self.profile_broker.upsert_unsearchables(
                models.UnsearchablesModel(
                    user_id=user_id,
                    data_sources=data_source_ids,
                    timestamp=datetime.now(tz=pytz.utc),
                )
            )

            message = "Unsearchable list updated."

        return jsonify(status="success", message=message)
