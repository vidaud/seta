from interface import Interface
from seta_flask_server.repository.models.resource import (
    ResourceModel,
    ResourceChangeRequestModel,
)


class IResourcesBroker(Interface):
    def create(self, model: ResourceModel, scopes: list[dict]) -> None:
        """Inserts resource model in database."""
        pass

    def update(self, model: ResourceModel) -> None:
        """Update resource model in database."""
        pass

    def delete(self, resource_id: str) -> None:
        """Delete all collection records for resource id."""
        pass

    def get_by_id(self, resource_id: str) -> ResourceModel:
        """resource by identifier."""
        pass

    def get_all_assigned_to_user_id(self, user_id: str) -> list[ResourceModel]:
        """Resources assigned to user."""
        pass

    def get_all_queryable_by_user_id(self, user_id: str) -> list[ResourceModel]:
        """Retrieve all resource ids that can be queried by user."""
        pass

    def get_all_by_member_id_and_type(
        self, user_id: str, resource_type: str
    ) -> list[ResourceModel]:
        """Resources within user memberships filter by type.

        Args:
            user_id: User identifier.
            type: Resource type, see ResourceTypeConstants.
        """
        pass

    def get_all_by_community_id(self, community_id: str) -> list[ResourceModel]:
        """Resources assigned to community."""
        pass

    def resource_id_exists(self, resource_id: str) -> bool:
        """Check if a resource identifier exists."""
        pass

    def get_all(self) -> list[ResourceModel]:
        """All resources."""
        pass


class IResourceChangeRequestsBroker(Interface):
    def create(self, model: ResourceChangeRequestModel) -> None:
        """Inserts a change request in database."""
        pass

    def update(self, model: ResourceChangeRequestModel) -> None:
        """Updates a change request in database."""
        pass

    def get_request(
        self, resource_id: str, request_id: str
    ) -> ResourceChangeRequestModel:
        """Request by resource and identifier."""
        pass

    def get_all_pending(self) -> list[ResourceChangeRequestModel]:
        """Pending change requests for resources."""
        pass

    def has_pending_field(self, resource_id: str, field_name: str) -> bool:
        """Check if there's another pending request for the same field."""
        pass

    def get_all_by_user_id(self, user_id: str) -> list[ResourceChangeRequestModel]:
        """Requests initiated by user."""
        pass

    def get_all_by_resource_id(
        self, resource_id: str
    ) -> list[ResourceChangeRequestModel]:
        """Requests for a resource."""
        pass

    def get_all_by_community_id(
        self, community_id: str
    ) -> list[ResourceChangeRequestModel]:
        """Resource requests filtered by community."""
        pass
