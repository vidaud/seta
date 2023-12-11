from interface import Interface


class IEmbeddingsAsync(Interface):
    async def chunks_and_embeddings_from_doc_fields(
        self, title: str, abstract: str, text: str
    ):
        """Compute embeddings from document fields."""

        pass

    async def chunks_and_embeddings_from_text(self, text: str):
        """Compute embeddings from text"""

        pass

    async def embedding_vector_from_text(self, text: str):
        """Compute vector from text"""

        pass
