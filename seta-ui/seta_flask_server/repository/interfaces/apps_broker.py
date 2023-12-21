from interface import Interface
from seta_flask_server.repository.models import SetaApplication


class IAppsBroker(Interface):
    def get_all_by_parent_id(self, parent_id: str) -> list[SetaApplication]:
        """All applications that belong to user.

        Args:
            parent_id: The parent user id.

        Returns:
            List of applications with the same parent id.
        """

        pass

    def get_by_name(self, name: str) -> SetaApplication:
        """Find application by name.

        Args:
            name: Searched name (case insensitive).

        Returns:
            Found application or None
        """

        pass

    def get_by_parent_and_name(self, parent_id: str, name: str) -> SetaApplication:
        """Find application by name that belongs to user.

        Args:
            parent_id: The parent user id.
            name: Searched name (case insensitive).

        Returns:
            Found application or None
        """

        pass

    def app_exists(self, name: str) -> bool:
        """Check if an application name exists.

        Args:
            name: Application name (case insensitive).

        Returns:
            Yes/no answer.
        """

        pass

    def get_by_user_id(self, user_id: str) -> SetaApplication:
        """Find application by its user identifier.

        Args:
            user_id:  The user identifier.

        Returns:
            Application assigned to a user.
        """

        pass

    def create(
        self,
        app: SetaApplication,
        copy_parent_rsa: bool = False,
    ):
        """Inserts an application record in the database.

        Args:
            app: The application object.
            copy_parent_rsa:
                Indicates that the new application has the same public key as its parent.
        """

        pass

    def update(self, old: SetaApplication, new: SetaApplication):
        """Updates an application (both name and description can be updated).

        Args
            old:
                The old version of application (both name and description).
            new:
                The new version of application.
        """

        pass

    def delete(self, parent_id: str, name: str):
        """Deletes an application.

        Args:
            parent_id: The parent user id.
            name: Application name (case insensitive).
        """

        pass
