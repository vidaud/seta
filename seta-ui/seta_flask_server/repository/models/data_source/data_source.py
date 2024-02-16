from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, EmailStr, HttpUrl, field_serializer

from seta_flask_server.infrastructure.constants import DataSourceStatusConstants

from .search_index import SearchIndexModel
from .data_source_scope import DataSourceScopeModel
from ..user_info import UserInfo


class DataSourceContactModel(BaseModel):
    email: EmailStr
    person: str
    website: HttpUrl

    @field_serializer("website")
    def serialize_website(self, website: HttpUrl):
        """Custom serializer for website field."""

        return str(website)


class DataSourceModel(BaseModel):
    data_source_id: str = Field(min_length=3, max_length=100, validation_alias="id")
    title: str = Field(min_length=3, max_length=200)
    description: str = Field(min_length=5, max_length=5000)
    index_name: str = Field(
        min_length=3,
        max_length=200,
        pattern=r"^[a-zA-Z0-9][a-zA-Z0-9_\-]*$",
        validation_alias="index",
    )
    organisation: str
    themes: list[str]
    status: str = DataSourceStatusConstants.ACTIVE.value
    contact: DataSourceContactModel
    creator_id: Optional[str] = None
    created_at: Optional[datetime] = None
    modified_at: Optional[datetime] = None

    creator: Optional[UserInfo] = Field(default=None, exclude=True)
    search_index: Optional[SearchIndexModel] = Field(default=None, exclude=True)
    scopes: Optional[list[DataSourceScopeModel]] = Field(default=None, exclude=True)
