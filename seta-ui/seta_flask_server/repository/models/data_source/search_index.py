from datetime import datetime
from pydantic import BaseModel, Field


class SearchIndexModel(BaseModel):
    index_name: str = Field(
        min_length=3,
        max_length=200,
        pattern=r"^[a-zA-Z0-9][a-zA-Z0-9_\-]*$",
        validation_alias="name",
    )
    created_at: datetime | None = None
    default: bool = False

    def model_post_init(self, __context) -> None:
        self.index_name = self.index_name.lower()
