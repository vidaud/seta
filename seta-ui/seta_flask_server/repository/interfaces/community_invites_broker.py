from interface import Interface
from seta_flask_server.repository.models import CommunityInviteModel


class ICommunityInvitesBroker(Interface):
    def create(self, model: CommunityInviteModel) -> bool:
        """Inserts model in database."""
        pass

    def update(self, model: CommunityInviteModel):
        """Updates model in database."""
        pass

    def get_by_invite_id(self, invite_id: str) -> CommunityInviteModel:
        """Invite by identifier."""
        pass

    def get_all_by_status_and_invited_user_id(
        self, user_id: str, status: str
    ) -> list[CommunityInviteModel]:
        """All user invites filtered by status."""
        pass

    def get_all_by_status_and_community_id(
        self, community_id: str, status: str
    ) -> list[CommunityInviteModel]:
        """All invites for a community filtered by status."""
        pass

    def get_all_by_initiated_by(self, user_id: str) -> list[CommunityInviteModel]:
        """Invites initiated by user."""
        pass
