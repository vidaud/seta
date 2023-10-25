from interface import Interface


class IStatsBroker(Interface):
    def count_community_change_requests(self) -> int:
        """Count pending change requests for communities."""

        pass

    def count_resource_change_requests(self) -> int:
        """Count of pending change requests for resources."""

        pass

    def count_community_orphans(self) -> int:
        """Count communities without an owner assigned (no user has scope '/seta/community/owner')."""

        pass

    def count_resource_orphans(self, resource_ids: list[str]) -> int:
        """Count of resource ids that are not defined in the database.

        Args:
            resource_ids: Resource ids from ElasticSearch.
        """

        pass
