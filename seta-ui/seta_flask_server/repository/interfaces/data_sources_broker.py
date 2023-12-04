from interface import Interface
from seta_flask_server.repository.models import DataSourceModel


class IDataSourcesBroker(Interface):
    def create(self, model: DataSourceModel) -> None:
        """Inserts data source model in database."""

        pass

    def update(self, model: DataSourceModel) -> None:
        """Updates data source model in database."""

        pass

    def update_status(self, data_source_id: str, status: str) -> None:
        """Sets data source status (active, archived)."""

        pass

    def get_by_id(self, data_source_id: str) -> DataSourceModel:
        """Retrieves data source by identifier."""

        pass

    def get_all(self, active_only: bool = True) -> list[DataSourceModel]:
        """Retrieves all data sources."""

        pass

    def identifier_exists(self, data_source_id: str) -> bool:
        """Checks existing data source identifier."""

        pass

    def title_exists(self, title: str) -> bool:
        """Checks existing data source title."""

        pass
