from interface import Interface
from seta_flask_server.repository.models import SetaUser, AccountInfo


class IUsersQueryBroker(Interface):
    def get_all(self, load_scopes: bool = True) -> list[SetaUser]:
        """All user accounts and their providers.

        Ignores entries with status 'deleted'.

        Args:
            load_scopes: Load permission scopes for each user
        """
        pass

    def get_all_by_status(self, status: str) -> list[SetaUser]:
        """All user accounts and their providers.

        Args:
            status: Filter accounts by status.
        """
        pass

    def get_account_details(self) -> list[AccountInfo]:
        """Seta accounts infos.

        Ignores entries with status 'deleted'.
        """

    def get_account_detail(self, user_id: str) -> AccountInfo:
        """Info for a seta account."""
        pass
