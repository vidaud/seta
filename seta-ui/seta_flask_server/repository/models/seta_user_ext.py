# pylint: disable=missing-function-docstring
from datetime import datetime
import pytz
import shortuuid

from seta_flask_server.infrastructure.constants import (
    UserRoleConstants,
    UserStatusConstants,
    ExternalProviderConstants,
    UserType,
)

from .user_claim import UserClaim
from .external_provider import ExternalProvider
from .seta_user import SetaUser


class SetaUserExt:
    @staticmethod
    def generate_uuid() -> str:
        return shortuuid.ShortUUID().random(length=20)

    @staticmethod
    def from_ecas_json(json_dct: dict) -> SetaUser:
        user_id = SetaUserExt.generate_uuid()

        user = SetaUser(
            user_id=user_id,
            email=json_dct["email"],
            user_type=UserType.User,
            status=UserStatusConstants.Active,
            created_at=datetime.now(tz=pytz.utc),
        )

        user.authenticated_provider = ExternalProvider(
            user_id=user_id,
            provider_uid=json_dct["uid"],
            provider=ExternalProviderConstants.ECAS,
            first_name=json_dct["firstName"],
            last_name=json_dct["lastName"],
            domain=json_dct["domain"],
        )

        SetaUserExt._set_common_props(user, json_dct.get("is_admin", False))

        return user

    @staticmethod
    def from_github_json(json_dct: dict) -> SetaUser:
        user_id = SetaUserExt.generate_uuid()

        user = SetaUser(
            user_id=user_id,
            email=json_dct["email"],
            user_type=UserType.User,
            status=UserStatusConstants.Active,
            created_at=datetime.now(tz=pytz.utc),
        )

        name = str(json_dct["name"]).split(maxsplit=1)
        first_name = name[0]
        if len(name) > 1:
            last_name = name[1]
        else:
            last_name = ""

        user.authenticated_provider = ExternalProvider(
            user_id=user_id,
            provider_uid=json_dct["login"],
            provider=ExternalProviderConstants.GITHUB,
            first_name=first_name,
            last_name=last_name,
            domain=json_dct["company"],
        )

        SetaUserExt._set_common_props(user, json_dct.get("is_admin", False))

        return user

    @staticmethod
    def _set_common_props(user: SetaUser, is_admin: bool):
        if is_admin:
            user.add_claim(
                UserClaim.create_role_claim(user.user_id, UserRoleConstants.Admin)
            )

            user.system_scopes = []

        else:
            user.add_claim(UserClaim.create_default_role_claim(user.user_id))
            user.system_scopes = []
