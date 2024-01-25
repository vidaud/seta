# pylint: disable=missing-function-docstring
from dataclasses import dataclass, asdict

from .seta_user import SetaUser
from seta_flask_server.infrastructure.constants import ExternalProviderConstants


@dataclass(kw_only=True)
class SetaApplication:
    user_id: str = None
    app_name: str
    app_description: str
    parent_user_id: str

    # local account object
    user: SetaUser = None
    # parent user object
    parent_user: SetaUser = None

    provider: str = ExternalProviderConstants.SETA

    _status: str = None

    def __post_init__(self):
        if self.app_name:
            self.app_name = self.app_name.lower()

    @property
    def status(self) -> str:
        if not self._status and self.user:
            self._status = self.user.status

        if self._status:
            return self._status

        return None

    @status.setter
    def status(self, value: str):
        self._status = value

    def to_json(self) -> dict:
        json = asdict(self)
        json.pop("user", None)
        json.pop("parent_user", None)
        json.pop("_status", None)

        return json

    @classmethod
    def from_db_json(cls, json_dict):
        return cls(
            user_id=json_dict["user_id"],
            app_name=json_dict["app_name"],
            app_description=json_dict["app_description"],
            parent_user_id=json_dict["parent_user_id"],
        )
