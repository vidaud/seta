import datetime
from dataclasses import dataclass, asdict

@dataclass(kw_only=True)        
class CommunityInviteModel:
    invite_id: str = None
    community_id: str = None    
    invited_user: str = None
    message: str = None
    status: str = None
    expire_date: datetime = None
    initiated_by: str = None    
    initiated_date: datetime = None
    modified_at: datetime = None
    
    def to_json(self):
        return asdict(self)
    
    def to_json_update(self):
        return{            
            "status": self.status,
            "modified_at": self.modified_at
        }
        
    @classmethod 
    def from_db_json(cls, json_dict):
        return cls(invite_id=json_dict["invite_id"],
                   community_id=json_dict["community_id"],
                   invited_user=json_dict["invited_user"],
                   message=json_dict["message"],
                   status=json_dict["status"],
                   expire_date=json_dict["expire_date"],
                   initiated_by=json_dict["initiated_by"],
                   initiated_date=json_dict["initiated_date"],
                   modified_at=json_dict["modified_at"])