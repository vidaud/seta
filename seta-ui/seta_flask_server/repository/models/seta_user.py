# pylint: disable=missing-function-docstring
from datetime import datetime
from flask import json

from seta_flask_server.infrastructure.constants import (
    ClaimTypeConstants,
    UserRoleConstants,
    UserStatusConstants,
    ExternalProviderConstants,
)

from .user_info import UserInfo
from .user_claim import UserClaim
from .system_scope import SystemScope
from .external_provider import ExternalProvider
from .data_source.data_source_scope import DataSourceScopeModel


class SetaUser:
    def __init__(
        self,
        user_id: str,
        email: str,
        user_type: str,
        status: str,
        created_at: datetime = None,
        modified_at: datetime = None,
    ) -> None:
        self.user_id = user_id

        self.email = None
        if email:
            self.email = email.lower()

        self.user_type = user_type
        self.status = status
        self.created_at = created_at
        self.modified_at = modified_at

        self._authenticated_provider = None
        self._external_providers = []
        self._claims = []

        self._data_source_scopes = []
        self._system_scopes = []

    def __iter__(self):
        yield from {
            "user_id": self.user_id,
            "email": self.email,
            "user_type": self.user_type,
            "status": self.status,
            "created_at": self.created_at,
            "modified_at": self.modified_at,
        }.items()

    def __str__(self) -> str:
        return json.dumps(self.to_json())

    def __repr__(self) -> str:
        return self.__str__()

    def to_json(self) -> dict:
        return dict(self)

    def to_identity_json(self) -> dict:
        if self.authenticated_provider is None:
            return {"user_id": self.user_id}

        return {
            "user_id": self.user_id,
            "provider": self.authenticated_provider.provider,
            "provider_uid": self.authenticated_provider.provider_uid,
        }

    @classmethod
    def from_db_json(cls, json_dict):
        return cls(
            user_id=json_dict["user_id"],
            email=json_dict["email"],
            user_type=json_dict["user_type"],
            status=json_dict["status"],
            created_at=json_dict["created_at"],
            modified_at=json_dict.get("modified_at", None),
        )

    @property
    def authenticated_provider(self):
        return self._authenticated_provider

    @authenticated_provider.setter
    def authenticated_provider(self, value: ExternalProvider):
        self._authenticated_provider = value

    @property
    def claims(self) -> list[UserClaim]:
        return self._claims

    @claims.setter
    def claims(self, value: list[UserClaim]):
        self._claims = value

    def add_claim(self, claim: UserClaim) -> None:
        self._claims.append(claim)

    @property
    def system_scopes(self) -> list[SystemScope]:
        return self._system_scopes

    @system_scopes.setter
    def system_scopes(self, value: list[SystemScope]):
        self._system_scopes = value

    @property
    def data_source_scopes(self) -> list[DataSourceScopeModel]:
        return self._data_source_scopes

    @data_source_scopes.setter
    def data_source_scopes(self, value: list[DataSourceScopeModel]):
        self._data_source_scopes = value

    @property
    def external_providers(self) -> list[ExternalProvider]:
        return self._external_providers

    @external_providers.setter
    def external_providers(self, value: list[ExternalProvider]):
        self._external_providers = value

    def add_external_provider(self, provider: ExternalProvider) -> None:
        self._external_providers.append(provider)

    @property
    def role(self) -> str:
        for uc in self._claims:
            if uc.claim_type == ClaimTypeConstants.RoleClaimType:
                return uc.claim_value

        return UserRoleConstants.User

    @property
    def user_info(self) -> UserInfo:
        if self.status.lower() == UserStatusConstants.Deleted:
            return UserInfo(user_id=self.user_id, full_name="Unknown", email="unknown")

        return UserInfo(
            user_id=self.user_id, email=self.email, full_name=self.full_name
        )

    @property
    def full_name(self) -> str:
        if self._authenticated_provider:
            return f"{self._authenticated_provider.last_name} {self._authenticated_provider.first_name}"

        if self.external_providers:
            # try to get ecas name
            provider = next(
                (
                    p
                    for p in self.external_providers
                    if p.provider.lower() == ExternalProviderConstants.ECAS.lower()
                ),
                None,
            )

            if provider is None:
                provider = self.external_providers[0]

            return f"{provider.last_name} {provider.first_name}"

        return None

    def is_not_active(self) -> bool:
        return self.status.lower() != UserStatusConstants.Active.lower()
