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
        if not self.exists(category=model.category, label=model.label):
            model.created_at = datetime.now(tz=pytz.utc)

            self.collection.insert_one(model.model_dump())

    def update(self, model: AnnotationModel) -> None:
        model.modified_at = datetime.now(tz=pytz.utc)

        json = model.model_dump(exclude={"category", "label", "created_at"})
        self.collection.update_one(
            _find_annotation_query(model.category, model.label), {"$set": json}
        )

    def delete(self, category: str, label: str) -> None:
        self.collection.delete_one(_find_annotation_query(category, label))

    def get(self, category: str, label: str) -> AnnotationModel:
        annotation = self.collection.find_one(_find_annotation_query(category, label))

        if annotation is not None:
            return _annotation_from_db_json(annotation)

        return None

    def get_all(self) -> list[AnnotationModel]:
        annotations = self.collection.find()
        return [_annotation_from_db_json(a) for a in annotations]

    def exists(self, category: str, label: str) -> bool:
        exists_count = self.collection.count_documents(
            _find_annotation_query(category, label)
        )
        return exists_count > 0

    def get_categories(self) -> list[str]:
        pipeline = [
            {"$group": {"_id": "$category"}},
        ]
        categories = self.collection.aggregate(pipeline)

        return [c["_id"] for c in categories]

    def bulk_import(self, categories: list[str], annotations: list[AnnotationModel]):
        with self.db.client.start_session(causal_consistency=True) as session:
            self.collection.delete_many(
                {"category": {"$in": categories}}, session=session
            )

            self.collection.insert_many(
                [annotation.model_dump() for annotation in annotations], session=session
            )


def _annotation_from_db_json(json_dict: dict) -> AnnotationModel:
    annotation = AnnotationModel.model_construct(
        label=json_dict["label"],
        category=json_dict["category"],
        color=json_dict["color"],
        created_at=json_dict.get("created_at"),
        modified_at=json_dict.get("modified_at"),
    )

    return annotation


def _find_annotation_query(category: str, label: str) -> dict:
    return {
        "category": {"$regex": f"^{category}$", "$options": "i"},
        "label": {"$regex": f"^{label}$", "$options": "i"},
    }
