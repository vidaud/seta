from interface import Interface
from seta_auth.repository.models import EntityScope, SystemScope

class IUserPermissionsBroker(Interface):

    def get_all_user_system_scopes(self, user_id: str) -> list[SystemScope]:
        pass

    def get_all_user_resource_scopes(self, user_id: str) -> list[EntityScope]:
        pass

    def get_all_user_community_scopes(self, user_id: str) -> list[EntityScope]:
        pass