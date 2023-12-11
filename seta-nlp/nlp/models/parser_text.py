from pydantic import BaseModel


class ParserText(BaseModel):
    text: str | None = None
