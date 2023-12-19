from pydantic import BaseModel


class Vector(BaseModel):
    vector: list[float]
