# pylint: disable=missing-function-docstring
from datetime import datetime
import pytz
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, IAnnotationsBroker
from seta_flask_server.repository.models import AnnotationCategoryModel, AnnotationModel


class AnnotationsBroker(implements(IAnnotationsBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.db = config.get_db()
        self.collection = self.db["annotations"]

    def create(self, model: AnnotationModel) -> None:
        if not self.identifier_exists(model.annotation_id):
            model.created_at = datetime.now(tz=pytz.utc)

            model_json = model.to_dict()
            self.collection.insert_one(model_json)

    def update(self, model: AnnotationModel) -> None:
        model.modified_at = datetime.now(tz=pytz.utc)

        json = model.to_dict(exclude={"created_at"})
        set_json = {"$set": json}

        self.collection.update_one({"annotation_id": model.annotation_id}, set_json)

    def update_status(self, annotation_id: str, status: str) -> None:
        set_json = {"$set": json}

        self.collection.update_one({"annotation_id": annotation_id}, set_json)

    def get_by_id(self, annotation_id: str) -> AnnotationModel:
        query_filter = {"annotation_id": annotation_id}
        ds = self.collection.find_one(query_filter)

        if ds is not None:
            return _annotations_from_db_json(ds)

        return None

    def get_all(self, active_only: bool = True) -> list[AnnotationModel]:
        query_filter = {"annotation_id": {"$exists": True}}

        annotations = self.collection.find(query_filter)
        return [_annotations_from_db_json(ds) for ds in annotations]

    def identifier_exists(self, annotation_id: str) -> bool:
        if annotation_id is None:
            return False

        exists_count = self.collection.count_documents(
            {"annotation_id": annotation_id.lower()}
        )
        return exists_count > 0

    def label_exists(self, label: str) -> bool:
        exists_count = self.collection.count_documents({"label": label})
        return exists_count > 0


def _annotations_category_from_db_json(json_dict: dict) -> AnnotationCategoryModel:
    return AnnotationCategoryModel.model_construct(
        category_id=json_dict.get("category_id", None),
        category_name=json_dict.get("category_name", None)
    )


def _annotations_from_db_json(json_dict: dict) -> AnnotationModel:
    annotation = AnnotationModel.model_construct(
        annotation_id=json_dict["annotation_id"],
        label=json_dict["label"],
        color_code=json_dict["color_code"],
        created_at=json_dict.get("created_at"),
        modified_at=json_dict.get("modified_at"),
    )

    if "category" in json_dict.keys() and json_dict["category"] is not None:
        annotation.category = _annotations_category_from_db_json(json_dict["category"])

    return annotation
