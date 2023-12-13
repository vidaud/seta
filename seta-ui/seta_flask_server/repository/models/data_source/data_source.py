from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, EmailStr, HttpUrl, field_serializer

from seta_flask_server.infrastructure.constants import DataSourceStatusConstants

from .search_index import SearchIndexModel
from .data_source_scope import DataSourceScopeModel
from ..user_info import UserInfo


class DataSourceContactModel(BaseModel):
    email: Optional[EmailStr] = None
    person: Optional[str] = None
    website: Optional[HttpUrl] = None

    @field_serializer("website")
    def serialize_website(self, website: HttpUrl):
        """Custom serializer for website field."""

        return str(website)


class DataSourceModel(BaseModel):
    data_source_id: str = Field(min_length=3, max_length=100, validation_alias="id")
    title: str = Field(min_length=3, max_length=200)
    description: str = Field(min_length=5, max_length=5000)
    index_name: str = Field(validation_alias="index")
    organisation: Optional[str] = None
    theme: Optional[str] = None
    status: DataSourceStatusConstants = DataSourceStatusConstants.ACTIVE
    contact: DataSourceContactModel = None
    creator_id: Optional[str] = None
    created_at: Optional[datetime] = None
    modified_at: Optional[datetime] = None

    creator: Optional[UserInfo] = Field(default=None, exclude=True)
    search_index: Optional[SearchIndexModel] = Field(default=None, exclude=True)
    scopes: Optional[list[DataSourceScopeModel]] = Field(default=None, exclude=True)

    def to_dict(self, exclude: set[str] = None):
        """Convert model to dictionary."""

        json = self.model_dump(exclude=exclude)
        return json
