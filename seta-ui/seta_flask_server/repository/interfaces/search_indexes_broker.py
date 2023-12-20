from interface import Interface
from seta_flask_server.repository.models import SearchIndexModel


class ISearchIndexesBroker(Interface):
    def create(self, model: SearchIndexModel) -> None:
        """Inserts search index model in database."""

        pass

    def get_all(self) -> list[SearchIndexModel]:
        """Retrieves all indexes."""

        pass

    def index_name_exists(self, index_name: str) -> bool:
        """Checks existing index name."""

        pass
