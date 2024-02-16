# pylint: disable=missing-function-docstring
from datetime import datetime
import pytz

from flask_sqlalchemy import SQLAlchemy
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, ISearchIndexesBroker
from seta_flask_server.repository.models import SearchIndexModel

from seta_flask_server.repository.orm_models import SearchIndexOrm


class OrmSearchIndexesBroker(implements(ISearchIndexesBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.config = config
        self.db: SQLAlchemy = config.get_db()

    def create(self, model: SearchIndexModel) -> None:
        orm_model = to_orm_model(model)
        orm_model.created_at = datetime.now(tz=pytz.utc)

        self.db.session.add(orm_model)
        self.db.session.commit()

    def get_all(self) -> list[SearchIndexModel]:
        models = self.db.session.query(SearchIndexOrm).all()

        if models:
            return [from_orm_model(model) for model in models]

        return []

    def index_name_exists(self, index_name: str) -> bool:
        exists = (
            self.db.session.query(SearchIndexOrm)
            .filter_by(index_name=index_name)
            .first()
        )
        return exists is not None


def to_orm_model(search_index: SearchIndexModel) -> SearchIndexOrm:
    return SearchIndexOrm(
        index_name=search_index.index_name,
        created_at=search_index.created_at,
        default=search_index.default,
    )


def from_orm_model(search_index: SearchIndexOrm) -> SearchIndexModel:
    return SearchIndexModel(
        name=search_index.index_name,
        created_at=search_index.created_at,
        default=search_index.default,
    )
