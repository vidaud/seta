import json
import datetime
import pytz
import shortuuid
from infrastructure.constants import ExternalProviderConstants
from .user_claim import UserClaim
from .external_provider import ExternalProvider

class SetaUser:
    
    def __init__(self, user_id, email, user_type, status, created_at, modified_at) -> None:
        self.user_id = user_id
        self.email = email
        self.user_type = user_type
        self.status = status
        self.created_at = created_at
        self.modified_at = modified_at
        
        self._authenticated_provider = None
        self._external_providers = []
        self._claims = []
        
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
    
    def set_authenticated_provider(self, provider: ExternalProvider) -> None:
        self._authenticated_provider = provider
        
    def add_claim(self, claim: UserClaim) -> None:
        self._claims.append(claim)
        
    def add_external_provider(self, provider: ExternalProvider) -> None:
        self._external_providers.append(provider)
        
    def set_claims(self, claims: list[UserClaim]) -> None:
        self._claims = claims
        
    def set_external_providers(self, providers: list[ExternalProvider]) -> None:
        self._external_providers = providers
        
    @staticmethod
    def generate_uuid() -> str:
        return shortuuid.ShortUUID().random(length=20)
    
    @classmethod
    def from_json(cls, json_dct):
      return cls(json_dct['user_id'],
                   json_dct['email'], 
                   json_dct['user_type'],
                   json_dct['status'],
                   json_dct['created_at'],
                   json_dct['modified_at'])
      
    @classmethod
    def from_ecas_json(cls, json_dct):
        user_id = SetaUser.generate_uuid()
        
        user = cls(user_id,
                   json_dct['email'], 
                   'user',
                   'active',
                   datetime.datetime.now(tz=pytz.utc),
                   None)
        
        user._authenticated_provider = ExternalProvider(user_id, json_dct['uid'], ExternalProviderConstants.ECAS, 
                                                        json_dct['first_name'], json_dct['last_name']
                                                        ,json_dct['domain'])
        
        role = json_dct.get('role')
        if role is None:
            user.add_claim(UserClaim.create_default_role_claim(user_id))
        else:
            user.add_claim(UserClaim.create_role_claim(user_id, role))
        
        return user
    
    @classmethod
    def from_github_json(cls, json_dct):
        user_id = SetaUser.generate_uuid()
        
        user = cls(user_id,
                   json_dct['email'], 
                   'user',
                   'active',
                   datetime.datetime.now(tz=pytz.utc),
                   None)
        
        name = str(json_dct["name"]).split(maxsplit=1)
        first_name = name[0]
        if len(name) > 1:
            last_name = name[1]
        else:
            last_name = ""
        
        user._authenticated_provider = ExternalProvider(user_id, json_dct['login'], ExternalProviderConstants.GITHUB, 
                                                        first_name, last_name
                                                        ,json_dct['company'])
        
        role = json_dct.get('role')
        if role is None:
            user.add_claim(UserClaim.create_default_role_claim(user_id))
        else:
            user.add_claim(UserClaim.create_role_claim(user_id, role))
        
        return user