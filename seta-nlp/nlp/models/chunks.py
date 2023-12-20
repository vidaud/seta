from pydantic import BaseModel
from .computed_embedding import ComputedEmbedding


class Chunks(BaseModel):
    emb_with_chunk_text: list[ComputedEmbedding]
