from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

from seta_flask_server.infrastructure.constants import DataSourceStatusConstants

from .user_info import UserInfo


class DataSourceContactModel(BaseModel):
    email: Optional[str] = None
    person: Optional[str] = None
    website: Optional[str] = None


class DataSourceModel(BaseModel):
    data_source_id: str = Field(min_length=3, max_length=100, validation_alias="id")
    title: str = Field(min_length=3, max_length=200)
    description: str = Field(min_length=10, max_length=5000)
    organisation: Optional[str] = None
    theme: Optional[str] = None
    status: DataSourceStatusConstants = DataSourceStatusConstants.ACTIVE
    contact: DataSourceContactModel = None
    creator_id: Optional[str] = None
    created_at: Optional[datetime] = None
    modified_at: Optional[datetime] = None

    creator: Optional[UserInfo] = None

    def to_dict(self):
        """Convert model to dictionary."""

        json = self.model_dump(exclude={"creator"})
        return json
