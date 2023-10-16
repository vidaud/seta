from interface import Interface
from seta_flask_server.repository.models.resource import (ResourceModel, ResourceContributorModel, ResourceChangeRequestModel)

class IResourcesBroker(Interface):
    def create(self, model: ResourceModel, scopes: list[dict]) -> None:
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
        '''Retrieve all resource ids that can be queried by user id'''
        pass

    def get_all_by_member_id_and_type(self, user_id:str, type: str) -> list[ResourceModel]:
        '''
        Retrieve all resources within user memberships filter by type

        :param user_id:
            User identifier
        :param type: 
            Resource type, see ResourceTypeConstants
        '''
        pass

    def get_all_by_community_id(self, community_id:str) -> list[ResourceModel]:
        pass

    def resource_id_exists(self, id: str) -> bool:
        pass   
    
    def get_all(self) -> list[ResourceModel]:
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
    
    def has_pending_field(self, resource_id: str, field_name: str) -> bool:
        pass
    
    def get_all_by_user_id(self, user_id: str) -> list[ResourceChangeRequestModel]:
        pass

    def get_all_by_resource_id(self, resource_id: str) -> list[ResourceChangeRequestModel]:
        pass     

    def get_all_by_community_id(self, community_id: str) -> list[ResourceChangeRequestModel]:
        pass   