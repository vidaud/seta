from interface import Interface
from seta_flask_server.repository.models import AnnotationModel


class IAnnotationsBroker(Interface):
    def create(self, model: AnnotationModel) -> None:
        """Inserts annotations model in database."""

        pass

    def update(self, model: AnnotationModel) -> None:
        """Updates annotations model in database."""

        pass
    
    def delete(self, annotation_id: str) -> None:
        """Deletes an annotation by identifier."""
        pass

    def get_by_id(self, annotation_id: str) -> AnnotationModel:
        """Retrieves annotation by identifier."""

        pass

    def get_all(self, active_only: bool = True) -> list[AnnotationModel]:
        """Retrieves all annotations."""

        pass

    def identifier_exists(self, annotation_id: str) -> bool:
        """Checks existing annotation identifier."""

        pass

    def label_exists(self, label: str) -> bool:
        """Checks existing annotation label."""

        pass
