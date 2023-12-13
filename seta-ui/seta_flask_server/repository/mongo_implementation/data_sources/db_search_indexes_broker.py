from datetime import datetime
import pytz
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, ISearchIndexesBroker
from seta_flask_server.repository.models import SearchIndexModel


class SearchIndexesBroker(implements(ISearchIndexesBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.db = config.get_db()
        self.collection = self.db["search-indexes"]

    def create(self, model: SearchIndexModel) -> None:
        """Inserts search index model in database."""

        if not self.index_name_exists(model.index_name):
            model.created_at = datetime.now(tz=pytz.utc)

            model_json = model.model_dump()
            self.collection.insert_one(model_json)

    def get_all(self) -> list[SearchIndexModel]:
        """Retrieves all indexes."""

        indexes = self.collection.find()
        return [_search_index_from_db_json(index) for index in indexes]

    def index_name_exists(self, index_name: str) -> bool:
        """Checks existing index name."""

        if index_name is None:
            return False

        exists_count = self.collection.count_documents(
            {"index_name": index_name.lower()}
        )
        return exists_count > 0


def _search_index_from_db_json(json_dict: dict) -> SearchIndexModel:
    return SearchIndexModel.model_construct(
        index_name=json_dict["index_name"],
        created_at=json_dict.get("created_at", None),
        default=json_dict.get("default", False),
    )
