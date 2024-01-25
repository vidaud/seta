import aiofiles
from interface import implements

from admin.config import Config
from admin.internal.interfaces import search_engine

from opensearchpy import AsyncOpenSearch

from .configuration import configuration


class OpenSearchEngine(implements(search_engine.ISearchEngineAsync)):
    def __init__(self, config: Config, verify_certs=False, request_timeout=120):
        self.config = config

        self.client = AsyncOpenSearch(
            hosts=[f"http://{config.ES_HOST}"],
            verify_certs=verify_certs,
            request_timeout=request_timeout,
        )

    async def index_exists(self, name: str) -> bool:
        """Check if index exists."""

        return await self.client.indices.exists(index=name)

    async def create_index(self, name: str):
        """Creates index in OpenSearch storage."""

        if await self.index_exists(name=name):
            return

        async with aiofiles.open(self.mapping_file, mode="r") as f:
            index_body = await f.read()

        async with aiofiles.open(self.mapping_crc_file, mode="r") as f:
            crc = await f.read()

        await self.client.indices.create(index=name, body=index_body)

        # adding crc mapping document
        await self.client.index(index=name, body={"crc_data_mapping": crc})

    async def delete_index(self, name: str):
        """Deletes index."""

        await self.client.indices.delete(index=name)

    async def cleanup(self):
        """Cleanup all data in OpenSearch storage."""

        await self.client.delete_by_query(index="*", body={"query": {"match_all": {}}})

    async def close(self):
        """Close connection."""

        await self.client.close()

    @property
    def mapping_file(self):
        """Gets mapping file path."""
        return self.config.MODELS_PATH + self.config.ES_INIT_DATA_CONFIG_FILE

    @property
    def mapping_crc_file(self):
        """Gets crc file path."""
        return self.config.MODELS_PATH + self.config.CRC_ES_INIT_DATA_CONFIG_FILE


async def get_search_client():
    """Creates an OpenSearch client."""

    search_client = OpenSearchEngine(config=configuration)
    try:
        yield search_client
    finally:
        await search_client.close()
