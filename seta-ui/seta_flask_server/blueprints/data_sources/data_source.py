from http import HTTPStatus
from injector import inject

from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from seta_flask_server.repository import interfaces

from .models import data_source_dto as dto

data_sources_ns = Namespace("Data Sources", description="List data sources")
data_sources_ns.models.update(dto.ns_models)


@data_sources_ns.route("", endpoint="data_sources", methods=["GET"])
class DataSourcesResource(Resource):
    @inject
    def __init__(
        self,
        data_sources_broker: interfaces.IDataSourcesBroker,
        profile_broker: interfaces.IUserProfileUnsearchables,
        *args,
        api=None,
        **kwargs,
    ):
        self.data_sources_broker = data_sources_broker
        self.profile_broker = profile_broker

        super().__init__(api, *args, **kwargs)

    @data_sources_ns.doc(
        description="Get a list of data sources available for search",
        responses={int(HTTPStatus.OK): "Retrieved data sources."},
        security="CSRF",
    )
    @data_sources_ns.marshal_list_with(dto.data_source_model, mask="*", skip_none=True)
    @jwt_required()
    def get(self):
        """Get a list of data sources available for search, available to any user"""

        identity = get_jwt_identity()
        user_id = identity["user_id"]

        data_sources = self.data_sources_broker.get_all()
        unsearchables = self.profile_broker.get_unsearchables(user_id=user_id)

        response = []

        for data_source in data_sources:
            ds_dict = data_source.to_dict(
                exclude={"creator", "creator_id", "modified_at", "status", "index_name"}
            )

            ds_dict["searchable"] = (
                unsearchables is None or data_source.data_source_id not in unsearchables
            )

            response.append(ds_dict)

        return response
