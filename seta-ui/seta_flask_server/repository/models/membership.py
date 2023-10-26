# pylint: disable=missing-function-docstring
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
import pytz

from seta_flask_server.infrastructure.constants import RequestStatusConstants
from .user_info import UserInfo


@dataclass
class MembershipModel:
    community_id: str
    user_id: str
    role: str = None
    join_date: datetime = None
    status: str = None
    modified_at: datetime = None

    user_info: UserInfo = None

    def __post_init__(self):
        if self.community_id:
            self.community_id = self.community_id.lower()

    def to_json(self) -> dict:
        json = asdict(self)
        json.pop("user_info", None)

        return json

    def to_json_update(self) -> dict:
        return {
            "role": self.role,
            "status": self.status,
            "modified_at": self.modified_at,
        }

    @classmethod
    def from_db_json(cls, json_dict):
        return cls(
            community_id=json_dict["community_id"],
            user_id=json_dict["user_id"],
            role=json_dict["role"],
            join_date=json_dict["join_date"],
            status=json_dict["status"],
            modified_at=json_dict.get("modified_at", None),
        )


@dataclass
class MembershipRequestModel:
    community_id: str
    requested_by: str
    message: str = None
    status: str = None
    initiated_date: datetime = None
    reviewed_by: str = None
    review_date: datetime = None

    requested_by_info: UserInfo = None
    reviewed_by_info: UserInfo = None

    def to_json(self) -> dict:
        json = asdict(self)

        json.pop("requested_by_info", None)
        json.pop("reviewed_by_info", None)
        json.pop("reject_timeout", None)

        return json

    def to_json_update(self):
        return {
            "status": self.status,
            "review_date": self.review_date,
            "reviewed_by": self.reviewed_by,
        }

    @property
    def reject_timeout(self) -> datetime:
        if self.status == RequestStatusConstants.Rejected:
            return (self.initiated_date + timedelta(days=30)).replace(tzinfo=pytz.utc)

        return None

    @classmethod
    def from_db_json(cls, json_dict: dict):
        return cls(
            community_id=json_dict["community_id"],
            requested_by=json_dict["requested_by"],
            message=json_dict["message"],
            status=json_dict["status"],
            initiated_date=json_dict["initiated_date"],
            reviewed_by=json_dict.get("reviewed_by"),
            review_date=json_dict.get("review_date"),
        )
