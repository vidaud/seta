from datetime import datetime
from dataclasses import dataclass, asdict

@dataclass(kw_only=True)
class SessionToken:
    session_id: str = None
    token_jti: str = None
    token_type: str = None
    created_at: datetime = None
    expires_at: datetime = None
    is_blocked: bool = False
    blocked_at: datetime = None
    
    def to_json(self):
        return asdict(self)
    
    @classmethod 
    def from_db_json(cls, json_dict: dict):
        return cls(session_id=json_dict["session_id"],
                   token_jti=json_dict["token_jti"],
                   token_type=json_dict["token_type"],
                   created_at=json_dict["created_at"],
                   expires_at=json_dict["expires_at"],
                   is_blocked=json_dict["is_blocked"],
                   blocked_at=json_dict.get("blocked_at"))


@dataclass(kw_only=True) 
class UserSession:
    session_id: str = None
    user_id: str = None
    authenticated_provider: dict = None
    created_at: datetime = None
    end_at: datetime = None
    session_tokens: list[SessionToken] = None
    
    def to_json(self):
        to_return = asdict(self)
        to_return.pop("session_tokens", None)
        
        return to_return
        
    
    @classmethod 
    def from_db_json(cls, json_dict: dict):
        return cls(session_id=json_dict["session_id"],
                   user_id=json_dict["user_id"],
                   authenticated_provider=json_dict.get("authenticated_provider"),
                   created_at=json_dict["created_at"],
                   end_at=json_dict.get("end_at"))
        
