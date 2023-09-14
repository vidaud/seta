from interface import Interface
from seta_flask_server.repository.models import LibraryItem

class ILibraryBroker(Interface):

    def create(self, items: list[LibraryItem]):
        """
            Insert a list of new library items in the database

            :param items:
                The new items for the library
        """

        pass

    def get_all_by_parent(self, user_id: str, parent_id: str) -> list[LibraryItem]:
        """
            Return the sorted children by 'type' and 'title' of the specified parent

            :param user_id:
                Identifier of the library owner

            :param parent_id:
                Parent identifier of the returned items
        """

        pass

    def get_by_id(self, user_id: str, id: str) -> LibraryItem:
        """
            Return the library item

            :param user_id:
                Identifier of the library owner

            :param id:
                Item identifier
        """

        pass

    def update(self, item: LibraryItem):
        """
            Update a library item

            :param item:
                The item to update
        """

        pass

    def delete(self, user_id: str, id: str):
        """
            Cascade delete a library item (all children included)

            :param id:
                Item identifier
        """

        pass