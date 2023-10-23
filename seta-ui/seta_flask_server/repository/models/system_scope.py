# pylint: disable=missing-function-docstring
from dataclasses import dataclass, asdict


@dataclass(kw_only=True)
class SystemScope:
    user_id: str
    area: str
    system_scope: str

    def to_json(self) -> dict:
        return asdict(self)

    @classmethod
    def from_db_json(cls, json_dict):
        return cls(
            user_id=json_dict["user_id"],
            area=json_dict["area"],
            system_scope=json_dict["system_scope"],
        )
