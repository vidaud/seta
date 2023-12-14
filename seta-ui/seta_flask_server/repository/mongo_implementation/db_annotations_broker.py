# pylint: disable=missing-function-docstring
from datetime import datetime
import pytz
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, IAnnotationsBroker
from seta_flask_server.repository.models import AnnotationModel


class AnnotationsBroker(implements(IAnnotationsBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.db = config.get_db()
        self.collection = self.db["annotations"]

    def create(self, model: AnnotationModel) -> None:
        if not self.label_exists(model.label):
            model.created_at = datetime.now(tz=pytz.utc)

            self.collection.insert_one(model.model_dump())

    def update(self, model: AnnotationModel) -> None:
        model.modified_at = datetime.now(tz=pytz.utc)

        json = model.model_dump(exclude={"label", "created_at"})
        self.collection.update_one({"label": model.label}, {"$set": json})

    def delete(self, label: str) -> None:
        self.collection.delete_one({"label": label})

    def get_by_label(self, label: str) -> AnnotationModel:
        annotation = self.collection.find_one({"label": label})

        if annotation is not None:
            return _annotation_from_db_json(annotation)

        return None

    def get_all(self) -> list[AnnotationModel]:
        annotations = self.collection.find()
        return [_annotation_from_db_json(a) for a in annotations]

    def label_exists(self, label: str) -> bool:
        exists_count = self.collection.count_documents({"label": label})
        return exists_count > 0

    def get_categories(self) -> list[str]:
        pipeline = [
            {"$group": {"_id": "$category"}},
        ]
        categories = self.collection.aggregate(pipeline)

        return [c["_id"] for c in categories]


def _annotation_from_db_json(json_dict: dict) -> AnnotationModel:
    annotation = AnnotationModel.model_construct(
        label=json_dict["label"],
        category=json_dict["category"],
        color_code=json_dict["color_code"],
        created_at=json_dict.get("created_at"),
        modified_at=json_dict.get("modified_at"),
    )

    return annotation
