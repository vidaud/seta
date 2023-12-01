# pylint: disable=missing-function-docstring
from datetime import datetime
import pytz
from interface import implements
from injector import inject

from seta_flask_server.infrastructure.constants import DataSourceStatusConstants
from seta_flask_server.repository.interfaces import IDbConfig, IDataSourcesBroker
from seta_flask_server.repository.models import DataSourceContactModel, DataSourceModel


class DataSourcesBroker(implements(IDataSourcesBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.db = config.get_db()
        self.collection = self.db["data-sources"]

    def create(self, model: DataSourceModel) -> None:
        if not self.identifier_exists(model.data_source_id):
            model.created_at = datetime.now(tz=pytz.utc)

            model_json = model.to_dict()
            self.collection.insert_one(model_json)

    def update(self, model: DataSourceModel) -> None:
        model.modified_at = datetime.now(tz=pytz.utc)

        json = model.to_dict(exclude={"created_at", "creator_id"})
        set_json = {"$set": json}

        self.collection.update_one({"data_source_id": model.data_source_id}, set_json)

    def update_status(self, data_source_id: str, status: str) -> None:
        json = {"modified_at": datetime.now(tz=pytz.utc), "status": status}

        set_json = {"$set": json}

        self.collection.update_one({"data_source_id": data_source_id}, set_json)

    def get_by_id(self, data_source_id: str) -> DataSourceModel:
        query_filter = {"data_source_id": data_source_id}
        ds = self.collection.find_one(query_filter)

        if ds is not None:
            return _data_source_from_db_json(ds)

        return None

    def get_all(self, active_only: bool = True) -> list[DataSourceModel]:
        query_filter = {"data_source_id": {"$exists": True}}

        if active_only:
            query_filter["status"] = DataSourceStatusConstants.ACTIVE

        data_sources = self.collection.find(query_filter)
        return [_data_source_from_db_json(ds) for ds in data_sources]

    def identifier_exists(self, data_source_id: str) -> bool:
        if data_source_id is None:
            return False

        exists_count = self.collection.count_documents(
            {"data_source_id": data_source_id.lower()}
        )
        return exists_count > 0

    def title_exists(self, title: str) -> bool:
        exists_count = self.collection.count_documents({"title": title})
        return exists_count > 0


def _data_source_contact_from_db_json(json_dict: dict) -> DataSourceContactModel:
    return DataSourceContactModel.model_construct(
        email=json_dict.get("email", None),
        person=json_dict.get("person", None),
        website=json_dict.get("website", None),
    )


def _data_source_from_db_json(json_dict: dict) -> DataSourceModel:
    data_source = DataSourceModel.model_construct(
        data_source_id=json_dict["data_source_id"],
        title=json_dict["title"],
        description=json_dict["description"],
        organisation=json_dict.get("organisation"),
        theme=json_dict.get("theme"),
        status=json_dict["status"],
        creator_id=json_dict.get("creator_id"),
        created_at=json_dict.get("created_at"),
        modified_at=json_dict.get("modified_at"),
    )

    if "contact" in json_dict.keys() and json_dict["contact"] is not None:
        data_source.contact = _data_source_contact_from_db_json(json_dict["contact"])

    return data_source
