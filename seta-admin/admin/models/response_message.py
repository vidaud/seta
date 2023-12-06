from enum import Enum
from pydantic import BaseModel


class ResponseStatus(str, Enum):
    SUCCESS = "success"
    ERROR = "error"


class ResponseMessage(BaseModel):
    status: ResponseStatus = ResponseStatus.SUCCESS
    message: str | None = None
