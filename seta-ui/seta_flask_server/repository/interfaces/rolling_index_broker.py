from interface import Interface
from seta_flask_server.repository.models import RollingIndex


class IRollingIndexBroker(Interface):
    def create(self, index: RollingIndex):
        """Inserts records in the database for a new rolling index.

        Name property is the unique key for rolling indexes.
        """

        pass

    def update(self, index: RollingIndex):
        """Updates a rolling index in the database.

        The record to updates is found by name.
        """

        pass

    def name_exists(self, rolling_index_name: str) -> bool:
        """Check if the rolling index name exists.

        Args:
            name: Rolling index name (case insensitive).

        Returns:
            Yes/no answer.
        """

        pass

    def title_exists(self, rolling_index_title: str, except_name: str = None) -> bool:
        """Check if the rolling index title exists.

        Args:
            rolling_index_title: Rolling index title (case sensitive).
            except_name: Rolling index name to except (case insensitive).

        Returns:
            Yes/no answer.
        """

        pass

    def create_active_index(self, rolling_index_name: str):
        """Inserts a new storage index for a rolling index.

        The new storage index becomes the active one for the rolling index.

        Args:
            name: Rolling index name (case insensitive).
        """

        pass

    def update_communities(self, rolling_index_name: str, community_ids: list[str]):
        """Update list of communities for a rolling index."""

        pass

    def get_all(self) -> list[RollingIndex]:
        """Rolling indexes."""

        pass

    def get_active_index(self, community_id: str) -> str:
        """Active storage indexes for community.

        If this community has no rolling index assigned, then the default active index is returned instead.

        Args:
            community_id: Community identifier

        Returns:
            Name of the active storage index
        """

        pass

    def get_storage_indexes_for_community(self, community_id: str) -> tuple[str]:
        """All storage indexes that were assigned to community.

        Searches for community identifier through all current and past community_ids collections.
        The storage names of the default rolling index are always appended to the return list.

        Args:
            community_id: Community identifier

        Returns:
            Name of all storage indexes where data can be found for the community resources.
        """

        pass

    def get_assigned_index(self, community_id: str) -> str:
        """Assigned rolling index for community.

        Args:
            community_id: Community identifier

        Returns:
            None or Name of the rolling index
        """

        pass
