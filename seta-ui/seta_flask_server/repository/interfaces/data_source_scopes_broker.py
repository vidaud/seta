from interface import Interface
from seta_flask_server.repository.models import DataSourceScopeModel


class IDataSourceScopesBroker(Interface):
    def get_all(self) -> list[DataSourceScopeModel]:
        """Retrieves all scopes."""

        pass

    def get_by_data_source_id(self, data_source_id: str) -> list[DataSourceScopeModel]:
        """Retrieves all scopes for a data source."""

        pass

    def get_by_user_id(self, user_id: str) -> list[DataSourceScopeModel]:
        """Retrieves all data source scopes for a user."""

        pass

    def replace_for_data_source(
        self, data_source_id: str, scopes: list[DataSourceScopeModel]
    ):
        """Replace all scopes for a data source."""

        pass
