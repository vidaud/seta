from interface import Interface
from seta_flask_server.repository.models import CommunityModel


class ICommunitiesBroker(Interface):
    def create(self, model: CommunityModel, scopes: list[dict]) -> None:
        """Inserts new databases community."""
        pass

    def update(self, model: CommunityModel) -> None:
        """Updates a databases community."""
        pass

    def delete(self, community_id: str) -> None:
        """Deletes a community by id"""
        pass

    def get_by_id(self, community_id: str) -> CommunityModel:
        """Community by id"""
        pass

    def community_id_exists(self, community_id: str) -> bool:
        """Community identifier exists?"""
        pass

    def get_all_by_user_id(self, user_id: str) -> list[CommunityModel]:
        """All communities filtered by user id"""
        pass

    def get_all(self) -> list[CommunityModel]:
        """All communities"""
        pass

    def get_all_by_ids(self, ids: list[str]) -> list[CommunityModel]:
        """Communities by ids list"""
        pass

    def get_orphans(self) -> list[CommunityModel]:
        """All communities without an owner assigned (no user has scope '/seta/community/owner')"""

        pass
