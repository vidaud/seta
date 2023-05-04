from datetime import datetime
from dataclasses import dataclass, asdict

@dataclass
class RsaKey:    
    user_id: str
    rsa_value: str
    created_at: datetime = None
    modified_at:datetime = None

    def to_json(self):
        return asdict(self)
    
    @classmethod
    def from_db_json(cls, json_dict: dict):
        return cls(user_id=json_dict["user_id"],
                   rsa_value=json_dict["rsa_value"],
                   created_at=json_dict["created_at"],
                   modified_at=json_dict.get("modified_at"))