from interface import Interface
from seta_flask_server.repository.models import UserProfileResources

class IUserProfile(Interface):

    #------un-searchable resources ----#

    def get_unsearchables(self, user_id: str) -> list[str]:
        pass

    def upsert_unsearchables(self, profile: UserProfileResources):
        pass

    def delete_unsearchables(self, user_id: str):
        pass

    #---------------------------------#