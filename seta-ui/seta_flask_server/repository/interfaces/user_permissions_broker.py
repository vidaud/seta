from interface import Interface
from seta_flask_server.repository.models import EntityScope, SystemScope

class IUserPermissionsBroker(Interface):

    def get_all_user_system_scopes(self, user_id: str) -> list[SystemScope]:
        pass

    def get_all_user_resource_scopes(self, user_id: str) -> list[EntityScope]:
        pass

    def get_all_user_community_scopes(self, user_id: str) -> list[EntityScope]:
        pass

    def get_user_community_scopes_by_id(self, user_id: str, community_id: str) -> list[EntityScope]:
        pass

    def get_user_resource_scopes_by_id(self, user_id: str, resource_id: str) -> list[EntityScope]:
        pass   

    def replace_all_user_system_scopes(self, user_id: str, scopes: list[SystemScope]) -> None:
        pass

    def replace_all_user_community_scopes(self, user_id: str, community_id: str, scopes: list[str]) -> None:
        pass

    def replace_all_user_resource_scopes(self, user_id: str, resource_id: str, scopes: list[str]) -> None:
        pass

    def get_all_resource_scopes(self, resource_id: str) -> list[EntityScope]:
        pass

    def get_all_community_scopes(self, community_id: str) -> list[EntityScope]:
        pass