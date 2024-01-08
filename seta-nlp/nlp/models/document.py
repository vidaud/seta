from pydantic import BaseModel


class Document(BaseModel):
    abstract: str | None = None
    term: str | None = None
    text: str | None = None
