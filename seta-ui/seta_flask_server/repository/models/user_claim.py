import json
from seta_flask_server.infrastructure.constants import ClaimTypeConstants, UserRoleConstants

class UserClaim:
    
    def __init__(self, user_id, claim_type, claim_value) -> None:
        self.user_id = user_id
        self.claim_type = claim_type
        self.claim_value = claim_value
        
    def __iter__(self):
        yield from {
            "user_id": self.user_id,
            "claim_type": self.claim_type,
            "claim_value": self.claim_value
        }.items()
        
    def __str__(self) -> str:
        return json.dumps(self.to_json())
    
    def __repr__(self) -> str:
        return self.__str__()

    def to_json(self) -> dict:
        return dict(self)
    
    @classmethod
    def create_role_claim(cls, user_id: str, role: str):
        return cls(user_id, ClaimTypeConstants.RoleClaimType, role)
    
    @classmethod
    def create_default_role_claim(cls, user_id: str):
        return cls(user_id, ClaimTypeConstants.RoleClaimType, UserRoleConstants.User)
    
    @classmethod 
    def from_db_json(cls, json_dict):
        return cls(json_dict["user_id"],
                   json_dict["claim_type"],
                   json_dict["claim_value"])
        