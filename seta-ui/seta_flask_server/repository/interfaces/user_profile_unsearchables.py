from interface import Interface
from seta_flask_server.repository.models import UnsearchablesModel


class IUserProfileUnsearchables(Interface):
    # ------un-searchable resources ----#

    def get_unsearchables(self, user_id: str) -> list[str]:
        """Un-searchable data source ids for the specified user."""
        pass

    def upsert_unsearchables(self, unsearchable: UnsearchablesModel):
        """Updates/Inserts restricted searchable data sources."""
        pass

    def delete_unsearchables(self, user_id: str):
        """Deletes restricted searchable resources."""
        pass

    # ---------------------------------#
