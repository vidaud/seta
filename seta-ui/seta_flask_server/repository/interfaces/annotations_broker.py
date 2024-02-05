from interface import Interface
from seta_flask_server.repository.models import AnnotationModel


class IAnnotationsBroker(Interface):
    def create(self, model: AnnotationModel) -> None:
        """Inserts annotations model in database."""

        pass

    def update(self, model: AnnotationModel) -> None:
        """Updates annotations model in database."""

        pass

    def delete(self, category: str, label: str) -> None:
        """Deletes an annotation by category & label."""
        pass

    def get(self, category: str, label: str) -> AnnotationModel:
        """Retrieves an annotation."""

        pass

    def get_all(self) -> list[AnnotationModel]:
        """Retrieves all annotations."""

        pass

    def exists(self, category: str, label: str) -> bool:
        """Checks existing annotation."""

        pass

    def get_categories(self) -> list[str]:
        """Get unique categories."""

        pass

    def bulk_import(self, categories: list[str], annotations: list[AnnotationModel]):
        """Bulk import annotations, clear existing categories."""

        pass
