# pylint: disable=missing-function-docstring
import datetime as dt
from dataclasses import dataclass, asdict

from .community import CommunityModel


@dataclass
class StorageLimits:
    total_files_no: int = -1
    total_storage_gb: float = 100

    def to_json(self):
        return asdict(self)

    @classmethod
    def from_db_json(cls, json_dict):
        return cls(
            total_files_no=json_dict["total_files_no"],
            total_storage_gb=json_dict["total_storage_gb"],
        )


@dataclass
class StorageIndex:
    name: str = None
    parent: str = None
    sequence: int = None
    is_active: bool = False
    created_at: dt.datetime = None
    modified_at: dt.datetime = None

    def __post_init__(self):
        if self.name:
            self.name = self.name.lower()

    def to_json(self) -> dict:
        return asdict(self)

    @classmethod
    def from_db_json(cls, json_dict: dict):
        return cls(
            name=json_dict["name"],
            parent=json_dict["parent"],
            sequence=json_dict["sequence"],
            is_active=json_dict.get("is_active", False),
            created_at=json_dict.get("created_at", None),
            modified_at=json_dict.get("modified_at", None),
        )

    @staticmethod
    def get_name(prefix: str, sequence: int):
        return f"{prefix.lower()}_{str(sequence).zfill(3)}"


@dataclass
class RollingIndex:
    rolling_index_name: str
    title: str
    description: str
    is_default: bool = False
    created_at: dt.datetime = None
    storage: list[StorageIndex] = None
    is_disabled: bool = False
    community_ids: list[str] = None
    past_community_ids: list[str] = None
    limits: StorageLimits = None

    # marshal api fields
    communities: list[CommunityModel] = None
    past_communities: list[CommunityModel] = None

    def __post_init__(self):
        if self.rolling_index_name:
            self.rolling_index_name = self.rolling_index_name.lower()

    def to_json(self) -> dict:
        json = asdict(self)
        json.pop("storage", None)

        return json

    def to_json_update(self):
        json = {
            "title": self.title,
            "description": self.description,
            "is_disabled": self.is_disabled,
        }

        if self.limits:
            json["limits"] = self.limits.to_json()

        return json

    @classmethod
    def from_db_json(cls, json_dict: dict):
        limits = None
        limits_dict = json_dict.get("limits", None)
        if limits_dict:
            limits = StorageLimits.from_db_json(limits_dict)

        return cls(
            rolling_index_name=json_dict["rolling_index_name"],
            title=json_dict["title"],
            description=json_dict["description"],
            is_default=json_dict["is_default"],
            is_disabled=json_dict["is_disabled"],
            created_at=json_dict.get("created_at", None),
            community_ids=json_dict.get("community_ids", None),
            past_community_ids=json_dict.get("past_community_ids", None),
            limits=limits,
        )
