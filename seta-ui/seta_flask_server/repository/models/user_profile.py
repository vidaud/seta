# pylint: disable=missing-function-docstring
from datetime import datetime
from dataclasses import dataclass, asdict


@dataclass
class UserProfileResources:
    UNSEARCHABLE_PROFILE_ID = "unsearchable-resources"

    user_id: str
    resources: list[str]
    timestamp: datetime = None

    def to_json(self) -> dict:
        return asdict(self)

    def to_update_json(self) -> dict:
        json = asdict(self)
        json.pop("user_id", None)

        return json

    @classmethod
    def from_db_json(cls, json_dict):
        return cls(
            user_id=json_dict["user_id"],
            resources=json_dict["resources"],
            timestamp=json_dict["timestamp"],
        )
