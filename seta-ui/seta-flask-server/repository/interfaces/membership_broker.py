from interface import Interface
from repository.models import MembershipModel, MembershipRequestModel


class IMembershipsBroker(Interface):
    def create_membership(self, model: MembershipModel) -> None:
        pass

    def update_membership(self, model: MembershipModel) -> None:
        pass
    
    def get_memberships_by_community_id(self, community_id: str) -> list[MembershipModel]:
        pass
    
    def get_memberships_by_user_id(self, user_id: str) -> list[MembershipModel]:
        pass
    
    def create_request(self, model: MembershipRequestModel) -> None:
        pass

    def update_request(self, model: MembershipRequestModel) -> None:
        pass
    
    def get_requests_by_community_id(self, community_id: str) -> list[MembershipRequestModel]:
        pass
    
    def get_requests_by_user_id(self, user_id: str) -> list[MembershipRequestModel]:
        pass    