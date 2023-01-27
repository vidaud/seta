from interface import Interface
from repository.models import CommunityModel

class ICommunitiesBroker(Interface):
    def create(self, model: CommunityModel) -> None:
        pass

    def update(self, model: CommunityModel) -> None:
        pass
    
    def delete(self, id: str) -> None:
        pass

    def get_by_id(self, id: str) -> CommunityModel:
        pass
    
    def community_id_exists(self, id: str) -> bool:
        pass
    
    def get_all_by_user_id(self, user_id:str) -> list[CommunityModel]:
        pass