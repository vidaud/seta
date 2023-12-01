from datetime import datetime
from pydantic import BaseModel, Field


class UnsearchablesModel(BaseModel):
    user_id: str
    data_sources: list[str] = Field(default_factory=list)
    timestamp: datetime = None
