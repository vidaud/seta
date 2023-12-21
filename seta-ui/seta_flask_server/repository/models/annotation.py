from datetime import datetime
from pydantic import BaseModel, Field


class AnnotationModel(BaseModel):
    label: str = Field(min_length=3, max_length=200)
    color: str = Field(pattern="^#(?:[0-9a-fA-F]{3}){1,2}$", validation_alias="color")
    category: str = Field(min_length=3, max_length=100)
    created_at: datetime | None = None
    modified_at: datetime | None = None
