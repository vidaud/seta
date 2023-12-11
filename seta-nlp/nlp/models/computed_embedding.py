from pydantic import BaseModel


class ComputedEmbedding(BaseModel):
    chunk: int
    version: str
    text: str
    vector: list[float]
