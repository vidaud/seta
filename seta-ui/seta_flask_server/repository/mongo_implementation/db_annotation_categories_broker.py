# pylint: disable=missing-function-docstring
from datetime import datetime
import pytz
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, IAnnotationCategoriesBroker
from seta_flask_server.repository.models import AnnotationCategoryModel


class AnnotationCategoriesBroker(implements(IAnnotationCategoriesBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.db = config.get_db()
        self.collection = self.db["annotation_categories"]

    def get_by_id(self, category_id: str) -> AnnotationCategoryModel:
        query_filter = {"category_id": category_id}
        ds = self.collection.find_one(query_filter)

        if ds is not None:
            return _annotations_category_from_db_json(ds)

        return None

    def get_all(self, active_only: bool = True) -> list[AnnotationCategoryModel]:
        query_filter = {"category_id": {"$exists": True}}

        annotation_categories = self.collection.find(query_filter)
        return [_annotations_category_from_db_json(ds) for ds in annotation_categories]



def _annotations_category_from_db_json(json_dict: dict) -> AnnotationCategoryModel:
    return AnnotationCategoryModel.model_construct(
        category_id=json_dict.get("category_id", None),
        category_name=json_dict.get("category_name", None)
    )