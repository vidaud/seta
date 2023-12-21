from interface import Interface
from seta_flask_server.repository.models import AnnotationModel


class IAnnotationsBroker(Interface):
    def create(self, model: AnnotationModel) -> None:
        """Inserts annotations model in database."""

        pass

    def update(self, model: AnnotationModel) -> None:
        """Updates annotations model in database."""

        pass

    def delete(self, label: str) -> None:
        """Deletes an annotation by label."""
        pass

    def get_by_label(self, label: str) -> AnnotationModel:
        """Retrieves annotation by label."""

        pass

    def get_all(self) -> list[AnnotationModel]:
        """Retrieves all annotations."""

        pass

    def label_exists(self, label: str) -> bool:
        """Checks existing label."""

        pass

    def get_categories(self) -> list[str]:
        """Get unique categories."""

        pass

    def bulk_import(self, categories: list[str], annotations: list[AnnotationModel]):
        """Bulk import annotations, clear existing categories."""

        pass
