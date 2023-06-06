from datetime import datetime
from flask import json
from dataclasses import dataclass, asdict, field

@dataclass
class CommunityModel:
    community_id: str
    title: str
    description: str
    membership: str
    status: str
    creator_id: str = None
    created_at: datetime = None
    modified_at: datetime = None
    creator: dict = field(init=False, repr=False)    
    
    def __post_init__(self):
        self.community_id = self.community_id.lower()        
        self.creator = {"user_id": self.creator_id, "full_name": None, "email": None}        

    def to_json(self) -> dict:
        json = asdict(self)
        json.pop("creator")
        
        return json
    
    def to_json_view(self) -> dict:
        return asdict(self)
    
    def to_json_update(self) -> dict:
        return{
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "modified_at": self.modified_at
        }
    
    @classmethod 
    def from_db_json(cls, json_dict: dict):
        return cls(community_id=json_dict["community_id"],
                   title=json_dict["title"],
                   description=json_dict["description"],
                   membership=json_dict["membership"],
                   status=json_dict["status"],
                   creator_id=json_dict["creator_id"],
                   created_at=json_dict["created_at"],
                   modified_at=json_dict.get("modified_at", None))
        
@dataclass(kw_only=True)        
class CommunityChangeRequestModel:
    request_id: str = None
    community_id: str = None    
    field_name: str = None
    new_value: str = None
    old_value: str = None
    requested_by: str = None
    status: str = None
    initiated_date: datetime = None
    reviewed_by: str = None
    review_date: datetime = None
    
    def to_json(self) -> dict:
        return asdict(self)
    
    def to_json_update(self) -> dict:
        return {            
            "status": self.status,
            "review_date": self.review_date,
            "reviewed_by": self.reviewed_by
        }
        
    @classmethod 
    def from_db_json(cls, json_dict):
        return cls(request_id=json_dict["request_id"],
                   community_id=json_dict["community_id"],
                   field_name=json_dict["field_name"],
                   new_value=json_dict["new_value"],
                   old_value=json_dict["old_value"],
                   requested_by=json_dict["requested_by"],
                   status=json_dict["status"],
                   initiated_date=json_dict["initiated_date"],
                   reviewed_by=json_dict["reviewed_by"],
                   review_date=json_dict["review_date"])