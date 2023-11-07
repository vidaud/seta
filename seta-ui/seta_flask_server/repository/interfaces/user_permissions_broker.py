from interface import Interface
from seta_flask_server.repository.models import EntityScope, SystemScope


class IUserPermissionsBroker(Interface):
    def get_all_user_system_scopes(self, user_id: str) -> list[SystemScope]:
        """System scopes assigned to user."""
        pass

    def get_all_user_resource_scopes(self, user_id: str) -> list[EntityScope]:
        """Resource scopes assigned to user."""
        pass

    def get_all_user_community_scopes(self, user_id: str) -> list[EntityScope]:
        """Community scopes assigned to user."""
        pass

    def get_user_community_scopes_by_id(
        self, user_id: str, community_id: str
    ) -> list[EntityScope]:
        """Community id scopes assigned to user."""
        pass

    def get_user_resource_scopes_by_id(
        self, user_id: str, resource_id: str
    ) -> list[EntityScope]:
        """Resource id scopes assigned to user."""
        pass

    def replace_all_user_system_scopes(
        self, user_id: str, scopes: list[SystemScope]
    ) -> None:
        """Replace all system scopes for user."""
        pass

    def replace_all_user_community_scopes(
        self, user_id: str, community_id: str, scopes: list[str]
    ) -> None:
        """Replace scopes for user and community pair."""
        pass

    def replace_all_user_resource_scopes(
        self, user_id: str, resource_id: str, scopes: list[str]
    ) -> None:
        """Replace scopes for user and resource pair."""
        pass

    def replace_all_resource_scopes_for_user(
        self, user_id: str, scopes: list[EntityScope]
    ) -> None:
        """Replace all resource scopes for user."""
        pass

    def get_all_resource_scopes(self, resource_id: str) -> list[EntityScope]:
        """Return all scopes for a resource."""
        pass

    def get_all_community_scopes(self, community_id: str) -> list[EntityScope]:
        """Return all scopes for a community."""
        pass
