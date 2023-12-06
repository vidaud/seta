from interface import Interface


class ISearchEngineAsync(Interface):
    async def index_exists(self, name: str) -> bool:
        """Checks index exists in search engine."""

        pass

    async def create_index(self, name: str):
        """Creates index in search engine."""

        pass

    async def delete_index(self, name: str):
        """Deletes an index and all its data."""

        pass

    async def close(self):
        """Close connection."""

        pass
