from datetime import datetime
from dataclasses import dataclass, asdict

@dataclass
class MembershipModel:
    community_id: str
    user_id: str
    role: str = None
    join_date: datetime = None
    status: str = None
    modified_at: datetime = None 
    
    def __post_init__(self):
        if self.community_id:
            self.community_id = self.community_id.lower()  

    def to_json(self) -> dict:
        return asdict(self)
    
    def to_json_update(self) -> dict:
        return{
            "role": self.role,
            "status": self.status,
            "modified_at": self.modified_at
        }
    
    @classmethod 
    def from_db_json(cls, json_dict):
        return cls(community_id=json_dict["community_id"],
                   user_id=json_dict["user_id"],
                   role=json_dict["role"],
                   join_date=json_dict["join_date"],
                   status=json_dict["status"],
                   modified_at=json_dict.get("modified_at", None))
     
@dataclass        
class MembershipRequestModel:
    community_id: str
    requested_by: str
    message: str = None
    status: str = None
    initiated_date: datetime = None
    reviewed_by: str = None
    review_date: datetime = None

    def to_json(self) -> dict:
        return asdict(self)
    
    def to_json_update(self):
        return{            
            "status": self.status,
            "review_date": self.review_date,
            "reviewed_by": self.reviewed_by
        }
    
    @classmethod 
    def from_db_json(cls, json_dict: dict):
        return cls(community_id=json_dict["community_id"],
                   requested_by=json_dict["requested_by"],
                   message=json_dict["message"],
                   status=json_dict["status"],
                   initiated_date=json_dict["initiated_date"],
                   reviewed_by=json_dict.get("reviewed_by"),
                   review_date=json_dict.get("review_date"))