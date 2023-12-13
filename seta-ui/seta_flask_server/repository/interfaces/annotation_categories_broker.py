from interface import Interface
from seta_flask_server.repository.models import AnnotationCategoryModel


class IAnnotationCategoriesBroker(Interface):
    def get_by_id(self, category_id: str) -> AnnotationCategoryModel:
        """Retrieves annotation category by identifier."""

        pass

    def get_all(self, active_only: bool = True) -> list[AnnotationCategoryModel]:
        """Retrieves all annotation categories."""

        pass

