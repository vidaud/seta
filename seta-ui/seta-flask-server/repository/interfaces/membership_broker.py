from interface import Interface
from repository.models import MembershipModel, MembershipRequestModel


class IMembershipsBroker(Interface):
    def create_membership(self, model: MembershipModel) -> None:
        pass

    def update_membership(self, model: MembershipModel) -> None:
        pass
    
    def delete_membership(self, community_id: str, user_id: str) -> None:
        pass
    
    def get_membership(self, community_id: str, user_id: str) -> MembershipModel:
        pass
    
    def get_memberships_by_community_id(self, community_id: str) -> list[MembershipModel]:
        pass
    
    def get_memberships_by_user_id(self, user_id: str) -> list[MembershipModel]:
        pass
    
    def membership_exists(self, community_id: str, user_id: str) -> bool:
        pass
    
    #---requests-----#
    def create_request(self, model: MembershipRequestModel) -> None:
        pass

    def update_request(self, model: MembershipRequestModel) -> None:
        pass
    
    def get_request(self, community_id: str, user_id: str) -> MembershipRequestModel:
        pass
    
    def get_requests_by_community_id(self, community_id: str) -> list[MembershipRequestModel]:
        pass
    
    def get_requests_by_user_id(self, user_id: str) -> list[MembershipRequestModel]:
        pass
    
    def request_exists(self, community_id: str,  user_id: str) -> bool:
        pass