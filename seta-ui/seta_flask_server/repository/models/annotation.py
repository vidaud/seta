from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr, HttpUrl, field_serializer

class AnnotationCategoryModel(BaseModel):
    category_id: Optional[str] = None
    category_name: Optional[str] = None

    def to_dict(self, exclude: set[str] = None):
        """Convert model to dictionary."""

        json = self.model_dump(exclude=exclude)
        return json


class AnnotationModel(BaseModel):
    annotation_id: str = Field(min_length=3, max_length=100, validation_alias="id")
    label: str = Field(min_length=3, max_length=200)
    color_code: str = Field(min_length=5, max_length=5000)
    category_id: str = Field(min_length=3, max_length=100)
    created_at: Optional[datetime] = None
    modified_at: Optional[datetime] = None
    category: Optional[AnnotationCategoryModel] = None

    def to_dict(self, exclude: set[str] = None):
        """Convert model to dictionary."""

        if exclude is None:
            exclude = {"category"}

        if not "category" in exclude:
            exclude.add("category")

        json = self.model_dump(exclude=exclude)
        return json
