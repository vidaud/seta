from interface import Interface
from seta_flask_server.repository.models import UserProfileResources


class IUserProfile(Interface):
    # ------un-searchable resources ----#

    def get_unsearchables(self, user_id: str) -> list[str]:
        """Un-searchable resource ids for the specified user."""
        pass

    def upsert_unsearchables(self, profile: UserProfileResources):
        """Updates/Inserts restricted searchable resources."""
        pass

    def delete_unsearchables(self, user_id: str):
        """Deletes restricted searchable resources."""
        pass

    # ---------------------------------#
