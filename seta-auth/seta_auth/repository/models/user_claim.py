from dataclasses import dataclass, asdict

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