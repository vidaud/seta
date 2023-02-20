from interface import Interface
from seta_flask_server.repository.models import EntityScope, SystemScope

class IUserPermissionsBroker(Interface):

    def get_all_system_scopes(self, user_id: str) -> list[SystemScope]:
        pass

    def get_all_resource_scopes(self, user_id: str) -> list[EntityScope]:
        pass

    def get_all_community_scopes(self, user_id: str) -> list[EntityScope]:
        pass

    def get_community_scopes_by_id(self, user_id: str, community_id: str) -> list[EntityScope]:
        pass

    def get_resource_scopes_by_id(self, user_id: str, resource_id: str) -> list[EntityScope]:
        pass   

    def replace_all_system_scopes(self, user_id: str, scopes: list[SystemScope]) -> None:
        pass

    def replace_community_scopes(self, user_id: str, community_id: str, scopes: list[EntityScope]) -> None:
        pass

    def replace_resource_scopes(self, user_id: str, resource_id: str, scopes: list[EntityScope]) -> None:
        pass