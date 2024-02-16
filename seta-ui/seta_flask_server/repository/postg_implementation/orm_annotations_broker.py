# pylint: disable=missing-function-docstring

from datetime import datetime
import pytz

from flask_sqlalchemy import SQLAlchemy
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, IAnnotationsBroker
from seta_flask_server.repository.models import AnnotationModel

from seta_flask_server.repository.orm_models import AnnotationOrm


class OrmAnnotationsBroker(implements(IAnnotationsBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.config = config
        self.db: SQLAlchemy = config.get_db()

    def create(self, model: AnnotationModel) -> None:
        if self.exists(category=model.category, label=model.label):
            return

        model.created_at = datetime.now(tz=pytz.utc)
        orm_model = to_orm_model(model)

        self.db.session.add(orm_model)
        self.db.session.commit()

    def update(self, model: AnnotationModel) -> None:
        orm_model = (
            self.db.session.query(AnnotationOrm)
            .filter_by(category=model.category, label=model.label)
            .first()
        )

        orm_model.color = model.color
        orm_model.modified_at = datetime.now(tz=pytz.utc)

        self.db.session.commit()

    def delete(self, category: str, label: str) -> None:
        self.db.session.query(AnnotationOrm).filter_by(
            category=category, label=label
        ).delete()
        self.db.session.commit()

    def get(self, category: str, label: str) -> AnnotationModel:
        annotation = (
            self.db.session.query(AnnotationOrm)
            .filter_by(category=category, label=label)
            .first()
        )

        if annotation is None:
            return None

        return from_orm_model(annotation)

    def get_all(self) -> list[AnnotationModel]:
        annotations = self.db.session.query(AnnotationOrm).all()

        if not annotations:
            return []

        return [from_orm_model(a) for a in annotations]

    def exists(self, category: str, label: str) -> bool:
        exists_count = (
            self.db.session.query(AnnotationOrm)
            .filter_by(category=category, label=label)
            .count()
        )
        return exists_count > 0

    def get_categories(self) -> list[str]:
        categories = self.db.session.query(AnnotationOrm.category).distinct().all()
        return [c[0] for c in categories]

    def bulk_import(self, categories: list[str], annotations: list[AnnotationModel]):
        with self.db.engine.connect() as connection:
            with connection.begin():
                connection.execute(
                    AnnotationOrm.__table__.delete().where(
                        AnnotationOrm.category.in_(categories)
                    )
                )
                connection.execute(
                    AnnotationOrm.__table__.insert(),
                    [to_orm_model(annotation).__dict__ for annotation in annotations],
                )


def to_orm_model(annotation: AnnotationModel) -> AnnotationOrm:
    return AnnotationOrm(
        category=annotation.category,
        label=annotation.label,
        color=annotation.color,
        created_at=annotation.created_at,
        modified_at=annotation.modified_at,
    )


def from_orm_model(annotation: AnnotationOrm) -> AnnotationModel:
    return AnnotationModel(
        category=annotation.category,
        label=annotation.label,
        color=annotation.color,
        created_at=annotation.created_at,
        modified_at=annotation.modified_at,
    )
