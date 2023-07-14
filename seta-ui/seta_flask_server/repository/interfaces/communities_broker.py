from interface import Interface
from seta_flask_server.repository.models import CommunityModel

class ICommunitiesBroker(Interface):
    def create(self, model: CommunityModel, scopes: list[dict]) -> None:
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
    
    def get_all(self) -> list[CommunityModel]:
        pass

    def get_orphans(self)  -> list[CommunityModel]:
        """Get all communities without an owner assigned (no user has scope '/seta/community/owner')"""

        pass