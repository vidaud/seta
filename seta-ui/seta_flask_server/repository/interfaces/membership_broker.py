from interface import Interface
from seta_flask_server.repository.models import MembershipModel, MembershipRequestModel


class IMembershipsBroker(Interface):
    def create_membership(
        self, model: MembershipModel, community_scopes: list[dict] = None
    ) -> None:
        """Creates community membership json objects in mongodb."""
        pass

    def update_membership(self, model: MembershipModel) -> None:
        """Updates membership fields."""
        pass

    def delete_membership(self, community_id: str, user_id: str) -> None:
        """Updates membership and its scopes."""
        pass

    def get_membership(self, community_id: str, user_id: str) -> MembershipModel:
        """Find membership by community and user identifiers."""
        pass

    def get_memberships_by_community_id(
        self, community_id: str
    ) -> list[MembershipModel]:
        """Community memberships."""
        pass

    def get_memberships_by_user_id(self, user_id: str) -> list[MembershipModel]:
        """User memberships."""
        pass

    def membership_exists(self, community_id: str, user_id: str) -> bool:
        """Check if user is a member of community."""
        pass

    # ---requests-----#
    def create_request(self, model: MembershipRequestModel) -> bool:
        """Creates a membership request."""
        pass

    def approve_request(
        self, model: MembershipRequestModel, community_scopes: list[dict]
    ) -> None:
        """Approves a membership request.

        Args:
            model: request model.
            community_scopes: assigned scopes in the community
        """
        pass

    def reject_request(self, model: MembershipRequestModel) -> None:
        """Rejects a request."""
        pass

    def get_request(self, community_id: str, user_id: str) -> MembershipRequestModel:
        """Find request by community and user identifiers."""
        pass

    def get_requests_by_community_ids(
        self, community_ids: list[str], status: str = None
    ) -> list[MembershipRequestModel]:
        """Community requests"""
        pass

    def get_requests_by_user_id(self, user_id: str) -> list[MembershipRequestModel]:
        """User requests."""
        pass

    def request_exists(self, community_id: str, user_id: str) -> bool:
        """Check if user sent a membership request fir the community."""
        pass
