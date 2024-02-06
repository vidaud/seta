# pylint: disable=missing-function-docstring

from flask_sqlalchemy import SQLAlchemy
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, IDataSourceScopesBroker
from seta_flask_server.repository.models import DataSourceScopeModel
from seta_flask_server.repository.orm_models import DataSourceScopeOrm


class OrmDataSourceScopesBroker(implements(IDataSourceScopesBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.config = config
        self.db: SQLAlchemy = config.get_db()

    def get_all(self) -> list[DataSourceScopeModel]:
        scopes = self.db.session.query(DataSourceScopeOrm).all()

        if scopes:
            return [_from_orm_model(scope) for scope in scopes]

        return []

    def get_by_data_source_id(self, data_source_id: str) -> list[DataSourceScopeModel]:
        scopes = (
            self.db.session.query(DataSourceScopeOrm)
            .filter_by(data_source_id=data_source_id)
            .all()
        )

        if scopes:
            return [_from_orm_model(scope) for scope in scopes]

        return []

    def get_by_user_id(self, user_id: str) -> list[DataSourceScopeModel]:
        scopes = (
            self.db.session.query(DataSourceScopeOrm).filter_by(user_id=user_id).all()
        )

        if scopes:
            return [_from_orm_model(scope) for scope in scopes]

        return []

    def replace_for_data_source(
        self, data_source_id: str, scopes: list[DataSourceScopeModel]
    ):
        self.db.session.query(DataSourceScopeOrm).filter_by(
            data_source_id=data_source_id
        ).delete()
        self.db.session.add_all([_to_orm_model(scope) for scope in scopes])

        self.db.session.commit()


def _to_orm_model(scope: DataSourceScopeModel) -> DataSourceScopeOrm:
    return DataSourceScopeOrm(
        data_source_id=scope.data_source_id,
        user_id=scope.user_id,
        scope=scope.scope,
    )


def _from_orm_model(scope: DataSourceScopeOrm) -> DataSourceScopeModel:
    return DataSourceScopeModel(
        data_source_id=scope.data_source_id,
        user_id=scope.user_id,
        scope=scope.scope,
    )
