# pylint: disable=missing-function-docstring

from datetime import datetime
import pytz

from flask_sqlalchemy import SQLAlchemy
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, IDataSourcesBroker
from seta_flask_server.repository.models import DataSourceModel, DataSourceContactModel
from seta_flask_server.infrastructure.constants import DataSourceStatusConstants

from seta_flask_server.repository.orm_models import DataSourceOrm


class OrmDataSourcesBroker(implements(IDataSourcesBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.config = config
        self.db: SQLAlchemy = config.get_db()

    def create(self, model: DataSourceModel) -> None:
        orm_model = to_orm_model(model)
        orm_model.created_at = datetime.now(tz=pytz.utc)

        self.db.session.add(orm_model)
        self.db.session.commit()

    def update(self, model: DataSourceModel) -> None:
        orm_model = (
            self.db.session.query(DataSourceOrm)
            .filter_by(id=model.data_source_id)
            .first()
        )

        if orm_model is not None:
            orm_model.title = model.title
            orm_model.description = model.description
            orm_model.organisation = model.organisation
            orm_model.themes = model.themes
            orm_model.status = model.status
            orm_model.modified_at = datetime.now(tz=pytz.utc)

            if model.contact is not None:
                orm_model.contact_person = model.contact.person

                if model.contact.email is not None:
                    orm_model.contact_email = str(model.contact.email)

                if model.contact.website is not None:
                    orm_model.contact_website = str(model.contact.website)

            self.db.session.commit()

    def update_status(self, data_source_id: str, status: str) -> None:
        self.db.session.query(DataSourceOrm).filter_by(id=data_source_id).update(
            {"status": status, "modified_at": datetime.now(tz=pytz.utc)}
        )
        self.db.session.commit()

    def get_by_id(self, data_source_id: str) -> DataSourceModel:
        orm_model = (
            self.db.session.query(DataSourceOrm).filter_by(id=data_source_id).first()
        )

        if orm_model is None:
            return None

        return from_orm_model(orm_model)

    def get_all(self, active_only: bool = True) -> list[DataSourceModel]:
        if active_only:
            orm_models = (
                self.db.session.query(DataSourceOrm)
                .filter_by(status=DataSourceStatusConstants.ACTIVE.value)
                .all()
            )
        else:
            orm_models = self.db.session.query(DataSourceOrm).all()

        if orm_models:
            return [from_orm_model(orm_model) for orm_model in orm_models]

        return []

    def identifier_exists(self, data_source_id: str) -> bool:
        exists = (
            self.db.session.query(DataSourceOrm).filter_by(id=data_source_id).first()
        )
        return exists is not None

    def title_exists(self, title: str) -> bool:
        exists = self.db.session.query(DataSourceOrm).filter_by(title=title).first()
        return exists is not None


def to_orm_model(data_source: DataSourceModel) -> DataSourceOrm:
    orm_model = DataSourceOrm(
        id=data_source.data_source_id,
        title=data_source.title,
        description=data_source.description,
        organisation=data_source.organisation,
        themes=data_source.themes,
        status=data_source.status,
        index_name=data_source.index_name,
        creator_id=data_source.creator_id,
        created_at=data_source.created_at,
        modified_at=data_source.modified_at,
    )

    if data_source.contact is not None:

        if data_source.contact.email is not None:
            orm_model.contact_email = str(data_source.contact.email)

        orm_model.contact_person = data_source.contact.person

        if data_source.contact.website is not None:
            orm_model.contact_website = str(data_source.contact.website)

    return orm_model


def from_orm_model(data_source: DataSourceOrm) -> DataSourceModel:
    contact = DataSourceContactModel(
        person=data_source.contact_person,
        email=data_source.contact_email,
        website=data_source.contact_website,
    )

    return DataSourceModel(
        id=data_source.id,
        title=data_source.title,
        description=data_source.description,
        organisation=data_source.organisation,
        themes=data_source.themes,
        status=data_source.status,
        index=data_source.index_name,
        creator_id=data_source.creator_id,
        created_at=data_source.created_at,
        modified_at=data_source.modified_at,
        contact=contact,
    )
