from interface import Interface
from seta_flask_server.repository.models import CommunityInviteModel

class ICommunityInvitesBroker(Interface):
    def create(self, model: CommunityInviteModel) -> bool:
        pass

    def update(self, model: CommunityInviteModel) -> None:
        pass

    def get_by_invite_id(self, invite_id: str) -> CommunityInviteModel:
        pass
    
    def get_all_by_status_and_invited_user_id(self, user_id: str, status: str) -> list[CommunityInviteModel]:
        pass
    
    def get_all_by_status_and_community_id(self, community_id: str, status: str) -> list[CommunityInviteModel]:
        pass
    
    def get_all_by_initiated_by(self, user_id: str) -> list[CommunityInviteModel]:
        pass