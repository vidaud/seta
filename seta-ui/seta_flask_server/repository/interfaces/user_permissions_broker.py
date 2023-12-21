from interface import Interface
from seta_flask_server.repository.models import SystemScope


class IUserPermissionsBroker(Interface):
    def get_all_user_system_scopes(self, user_id: str) -> list[SystemScope]:
        """System scopes assigned to user."""
        pass

    def replace_all_user_system_scopes(
        self, user_id: str, scopes: list[SystemScope]
    ) -> None:
        """Replace all system scopes for user."""
        pass
