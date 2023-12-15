from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, IDataSourceScopesBroker
from seta_flask_server.repository.models import DataSourceScopeModel


class DataSourceScopesBroker(implements(IDataSourceScopesBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.db = config.get_db()
        self.collection = self.db["data-source-scopes"]

    def get_all(self) -> list[DataSourceScopeModel]:
        """Retrieves all scopes."""

        scopes = self.collection.find()

        return [_data_source_scope_from_db_json(scope) for scope in scopes]

    def get_by_data_source_id(self, data_source_id: str) -> list[DataSourceScopeModel]:
        """Retrieves all scopes for a data source."""

        scopes = self.collection.find({"data_source_id": data_source_id})

        return [_data_source_scope_from_db_json(scope) for scope in scopes]

    def get_by_user_id(self, user_id: str) -> list[DataSourceScopeModel]:
        """Retrieves all data source scopes for a user."""

        scopes = self.collection.find({"user_id": user_id})

        return [_data_source_scope_from_db_json(scope) for scope in scopes]

    def replace_for_data_source(
        self, data_source_id: str, scopes: list[DataSourceScopeModel]
    ):
        """Replace all scopes for a data source."""

        scope_list = [s.model_dump() for s in scopes]

        with self.db.client.start_session(causal_consistency=True) as session:
            # delete existing system scopes
            self.collection.delete_many(
                {"data_source_id": data_source_id}, session=session
            )
            # insert new scopes
            if scope_list:
                self.collection.insert_many(scope_list, session=session)


def _data_source_scope_from_db_json(json_dict: dict) -> DataSourceScopeModel:
    return DataSourceScopeModel.model_construct(
        data_source_id=json_dict["data_source_id"],
        user_id=json_dict["user_id"],
        scope=json_dict["scope"],
    )
