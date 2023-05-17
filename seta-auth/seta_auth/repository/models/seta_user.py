from flask import json
from .user_claim import UserClaim
from .entity_scope import EntityScope
from .system_scope import SystemScope
from .external_provider import ExternalProvider
from seta_auth.infrastructure.constants import ClaimTypeConstants

class SetaUser:
    
    def __init__(self, user_id, email, user_type, status, created_at = None, modified_at = None) -> None:
        self.user_id = user_id
        self.email = email.lower()
        self.user_type = user_type
        self.status = status
        self.created_at = created_at
        self.modified_at = modified_at
        
        self._authenticated_provider = None
        self._external_providers = []
        self._claims = []

        self._community_scopes = []
        self._resource_scopes = []
        self._system_scopes = []
        
    def __iter__(self):
        yield from {
            "user_id": self.user_id,
            "email": self.email,
            "user_type": self.user_type,
            "status": self.status,
            "created_at": self.created_at,
            "modified_at": self.modified_at
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

        return {"user_id": self.user_id,
            "provider": self.authenticated_provider.provider,
            "provider_uid": self.authenticated_provider.provider_uid
        }
    
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

    @property
    def system_scopes(self) -> list[SystemScope]:
        return self._system_scopes
    
    @system_scopes.setter
    def system_scopes(self, value: list[SystemScope]):
        self._system_scopes = value        

    @property
    def community_scopes(self) -> list[EntityScope]:
        return self._community_scopes
    
    @community_scopes.setter
    def community_scopes(self, value: list[EntityScope]):
        self._community_scopes = value

    @property
    def resource_scopes(self) -> list[EntityScope]:
        return self._resource_scopes
    
    @resource_scopes.setter
    def resource_scopes(self, value: list[EntityScope]):
        self._resource_scopes = value
        
    @property
    def external_providers(self) -> list[ExternalProvider]:
        return self._external_providers
    
    @external_providers.setter
    def external_providers(self, value: list[ExternalProvider]):
        self._external_providers = value
            
    @property
    def role(self) -> str:
        for uc in self._claims:
            if uc.claim_type == ClaimTypeConstants.RoleClaimType:
                return uc.claim_value
        
        return "User"

    def has_community_scope(self, id: str, scope: str) -> bool:
        if self._community_scopes is None:
            return False

        return any(cs.id.lower() == id.lower() and cs.scope == scope for cs in self._community_scopes)

    def has_any_community_scope(self, id: str, scopes: list[str]) -> bool:
        if self._community_scopes is None:
            return False

        for scope in scopes:
            if self.has_community_scope(id=id, scope=scope):
                return True
        
        return False

    def has_all_community_scopes(self, id: str, scopes: list[str]) -> bool:
        if scopes is None or len(scopes) == 0:
            return False

        if self._community_scopes is None:
            return False

        for scope in scopes:
            if not self.has_community_scope(id=id, scope=scope):
                return False
        
        return True

    def has_resource_scope(self, id: str, scope: str) -> bool:
        if self._resource_scopes is None:
            return False

        return any(cs.id.lower() == id.lower() and cs.scope == scope for cs in self._resource_scopes)

    def has_any_resource_scope(self, id: str, scopes: list[str]) -> bool:
        if self._resource_scopes is None:
            return False

        for scope in scopes:
            if self.has_resource_scope(id=id, scope=scope):
                return True
        return False

    def has_system_scope(self, scope: str) -> bool:
        if self._system_scopes is None:
            return False

        return any(cs.scope == scope for cs in self._system_scopes)

    def has_any_system_scope(self, scopes: list[str]) -> bool:
        if self._system_scopes is None:
            return False

        for scope in scopes:
            if self.has_system_scope(scope):
                return True
        
        return False  
    
    @classmethod 
    def from_db_json(cls, json_dict):
        return cls(user_id=json_dict["user_id"],
                   email=json_dict["email"],
                   user_type=json_dict["user_type"],
                   status=json_dict["status"],
                   created_at=json_dict["created_at"],
                   modified_at=json_dict.get("modified_at", None))