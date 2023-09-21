from interface import Interface
from seta_flask_server.repository.models import SetaUser, AccountInfo

class IUsersQueryBroker(Interface):
    def get_all(self, load_scopes: bool = True) -> list[SetaUser]:
        """
        Return the list of all user accounts and their providers; ignore entries with status 'deleted'

        :param load_scopes:
            Load permission scopes for each user
        """
        pass

    def get_all_by_status(self, status: str) -> list[SetaUser]:
        """
        Return the list of all user accounts and their providers by user status ('active', 'blocked', 'disabled')

        :param status:
            Filter by status
        """
        pass

    def get_account_details(self) -> list[AccountInfo]:
        """
        Return details for seta accounts; ignore entries with status 'deleted'
        """

    def get_account_detail(self, user_id: str) -> AccountInfo:
        """
        Return details for seta account
        """
        pass