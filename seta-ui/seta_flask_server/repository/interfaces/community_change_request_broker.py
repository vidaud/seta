from interface import Interface
from seta_flask_server.repository.models import CommunityChangeRequestModel


class ICommunityChangeRequestsBroker(Interface):
    def create(self, model: CommunityChangeRequestModel) -> None:
        """Insert model in database."""
        pass

    def update(self, model: CommunityChangeRequestModel) -> None:
        """Update model in database."""
        pass

    def get_request(
        self, community_id: str, request_id: str
    ) -> CommunityChangeRequestModel:
        """Community request.

        Args:
            community_id: Community identifier.
            request_id: Request identifier.
        """
        pass

    def get_all_pending(self) -> list[CommunityChangeRequestModel]:
        """Pending requests."""
        pass

    def has_pending_field(self, community_id: str, field_name: str) -> bool:
        """Check if community has pending request for field.

        Args:
            community_id: Community identifier.
            field_name: Community field

        Returns: Yes/no answer.
        """
        pass

    def get_all_by_user_id(self, user_id: str) -> list[CommunityChangeRequestModel]:
        """All requests issued by user."""
        pass

    def get_all_by_community_id(
        self, community_id: str
    ) -> list[CommunityChangeRequestModel]:
        """All requests for a community."""
        pass
