from dataclasses import dataclass, asdict
from seta_flask_server.infrastructure.constants import ClaimTypeConstants, UserRoleConstants

@dataclass(kw_only=True)
class UserClaim:
    user_id: str
    claim_type: str    
    claim_value: str

    def to_json(self) -> dict:
        return asdict(self)
    
    @classmethod 
    def from_db_json(cls, json_dict):
        return cls(user_id=json_dict["user_id"],
                   claim_type=json_dict["claim_type"],
                   claim_value=json_dict["claim_value"])
    
    @classmethod
    def create_role_claim(cls, user_id: str, role: str):
        return cls(user_id=user_id, claim_type=ClaimTypeConstants.RoleClaimType, claim_value=role)
    
    @classmethod
    def create_default_role_claim(cls, user_id: str):
        return cls(user_id=user_id, claim_type=ClaimTypeConstants.RoleClaimType, claim_value=UserRoleConstants.User)
    
    @classmethod 
    def from_db_json(cls, json_dict):
        return cls(user_id=json_dict["user_id"],
                   claim_type=json_dict["claim_type"],
                   claim_value=json_dict["claim_value"])
        