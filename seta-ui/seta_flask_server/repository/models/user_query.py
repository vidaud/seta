# pylint: disable=missing-function-docstring
from datetime import datetime
from dataclasses import dataclass, asdict


@dataclass
class UserQuery:
    user_id: str
    query_key: str
    query_value: str
    created_at: datetime
    modified_at: datetime = None

    def to_json(self):
        return asdict(self)
