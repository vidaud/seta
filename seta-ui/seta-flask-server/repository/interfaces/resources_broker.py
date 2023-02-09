from interface import Interface
from repository.models.resource import (ResourceModel, ResourceContributorModel, ResourceChangeRequestModel)

class IResourcesBroker(Interface):
    def create(self, model: ResourceModel) -> None:
        pass

    def update(self, model: ResourceModel) -> None:
        pass

    def delete(self, id: str) -> None:
        pass

    def get_by_id(self, id: str) -> ResourceModel:
        pass

    def get_all_assigned_to_user_id(self, user_id:str) -> list[ResourceModel]:
        pass
    
    def get_all_queryable_by_user_id(self, user_id:str) -> list[ResourceModel]:
        pass

    def get_all_by_community_id(self, community_id:str) -> list[ResourceModel]:
        pass

    def resource_id_exists(self, id: str) -> bool:
        pass       
    

class IResourceContributorsBroker(Interface):
    def create(self, model: ResourceContributorModel):
        pass

    def get_all_by_resource_id(self, resource_id:str) -> list[ResourceContributorModel]:
        pass

class IResourceChangeRequestsBroker(Interface):
    def create(self, model: ResourceChangeRequestModel) -> None:
        pass

    def update(self, model: ResourceChangeRequestModel) -> None:
        pass
    
    def get_request(self, resource_id: str, request_id: str) -> ResourceChangeRequestModel:
        pass
    
    def get_all_pending(self) -> list[ResourceChangeRequestModel]:
        pass
    
    def has_pending_field(self, resource_id: str, filed_name: str) -> bool:
        pass
    
    def get_all_by_user_id(self, user_id:str) -> list[ResourceChangeRequestModel]:
        pass        