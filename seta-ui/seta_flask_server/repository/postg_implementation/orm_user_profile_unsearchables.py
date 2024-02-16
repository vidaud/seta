# pylint: disable=missing-function-docstring

from flask_sqlalchemy import SQLAlchemy
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, IUserProfileUnsearchables
from seta_flask_server.repository.models import UnsearchablesModel

from seta_flask_server.repository.orm_models import UnsearchablesOrm


class OrmUserProfileUnsearchablesBroker(implements(IUserProfileUnsearchables)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.config = config
        self.db: SQLAlchemy = config.get_db()

    def get_unsearchables(self, user_id: str) -> list[str]:
        unsearchables = (
            self.db.session.query(UnsearchablesOrm).filter_by(user_id=user_id).first()
        )

        if unsearchables and unsearchables.data_sources:
            return unsearchables.data_sources

        return None

    def upsert_unsearchables(self, unsearchable: UnsearchablesModel):
        orm_model = (
            self.db.session.query(UnsearchablesOrm)
            .filter_by(user_id=unsearchable.user_id)
            .first()
        )

        if orm_model is None:
            orm_model = to_orm_model(unsearchable)
            self.db.session.add(orm_model)
        else:
            orm_model.data_sources = unsearchable.data_sources
            orm_model.timestamp = unsearchable.timestamp

        self.db.session.commit()

    def delete_unsearchables(self, user_id: str):
        self.db.session.query(UnsearchablesOrm).filter_by(user_id=user_id).delete()
        self.db.session.commit()


def to_orm_model(unsearchable: UnsearchablesModel) -> UnsearchablesOrm:
    return UnsearchablesOrm(
        user_id=unsearchable.user_id,
        data_sources=unsearchable.data_sources,
        timestamp=unsearchable.timestamp,
    )
