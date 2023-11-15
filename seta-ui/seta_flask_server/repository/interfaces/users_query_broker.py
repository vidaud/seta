from interface import Interface
from seta_flask_server.repository.models import SetaUser, AccountInfo
from seta_flask_server.repository.models.filters import filter_users as fu


class IUsersQueryBroker(Interface):
    def get_all(
        self, filter_users: fu.FilterUsers = None, load_scopes: bool = True
    ) -> list[SetaUser]:
        """All user accounts and their providers.

        Ignores entries with status 'deleted'.

        Args:
            load_scopes: Load permission scopes for each user
            filter_users: Specify filter for user list
        """
        pass

    def get_account_details(self) -> list[AccountInfo]:
        """Seta accounts infos.

        Ignores entries with status 'deleted'.
        """

    def get_account_detail(self, user_id: str) -> AccountInfo:
        """Info for a seta account."""
        pass
