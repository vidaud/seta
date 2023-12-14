from datetime import datetime
from pydantic import BaseModel, Field


class AnnotationModel(BaseModel):
    label: str = Field(min_length=3, max_length=200)
    color: str = Field(min_length=5, max_length=5000, validation_alias="color")
    category: str = Field(min_length=3, max_length=100)
    created_at: datetime | None = None
    modified_at: datetime | None = None
