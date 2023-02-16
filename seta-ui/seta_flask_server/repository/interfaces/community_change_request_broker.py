from interface import Interface
from seta_flask_server.repository.models import CommunityChangeRequestModel

class ICommunityChangeRequestsBroker(Interface):
    def create(self, model: CommunityChangeRequestModel) -> None:
        pass

    def update(self, model: CommunityChangeRequestModel) -> None:
        pass
    
    def get_request(self, community_id: str, request_id: str) -> CommunityChangeRequestModel:
        pass
    
    def get_all_pending(self) -> list[CommunityChangeRequestModel]:
        pass
    
    def has_pending_field(self, community_id: str, filed_name: str) -> bool:
        pass
    
    def get_all_by_user_id(self, user_id:str) -> list[CommunityChangeRequestModel]:
        pass