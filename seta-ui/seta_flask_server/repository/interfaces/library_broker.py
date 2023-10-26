from interface import Interface
from seta_flask_server.repository.models import LibraryItem


class ILibraryBroker(Interface):
    def create(self, items: list[LibraryItem]):
        """Inserts a list of new library items in the database."""

        pass

    def get_all_by_parent(self, user_id: str, parent_id: str) -> list[LibraryItem]:
        """Sorted children of the specified parent.

        Args:
            user_id:  Identifier of the library owner.
            parent_id: Parent identifier of the returned items

        Returns:
            List of library items sorted by 'type' and 'title'
        """

        pass

    def get_by_id(self, user_id: str, item_id: str) -> LibraryItem:
        """Library item by internal identifier

        :param user_id:
            Identifier of the library owner

        :param id:
            Item identifier
        """

        pass

    def update(self, item: LibraryItem):
        """Updates a library item."""

        pass

    def delete(self, user_id: str, item_id: str):
        """Cascade delete a library item (all children included)."""

        pass
