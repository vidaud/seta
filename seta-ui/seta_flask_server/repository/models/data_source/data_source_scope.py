from enum import Enum
from pydantic import BaseModel, Field

from ..user_info import UserInfo


class DataSourceScopeEnum(str, Enum):
    DATA_OWNER = "/seta/data-source/owner"


class DataSourceScopeModel(BaseModel):
    data_source_id: str
    user_id: str
    scope: DataSourceScopeEnum

    user: UserInfo | None = Field(default=None, exclude=True)
