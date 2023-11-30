from http import HTTPStatus
from injector import inject

from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required

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
        *args,
        api=None,
        **kwargs,
    ):
        self.data_sources_broker = data_sources_broker

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

        return self.data_sources_broker.get_all()
