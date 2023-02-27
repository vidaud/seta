import datetime
from flask import json
from dataclasses import dataclass, asdict

class CommunityModel:
    
    def __init__(self, community_id, title, description, membership, data_type, status, creator_id=None, created_at = None, modified_at = None) -> None:
        self.community_id = community_id.lower()
        self.title = title
        self.description = description
        self.membership = membership
        self.data_type = data_type
        self.status = status
        self.creator_id = creator_id
        self.created_at = created_at
        self.modified_at = modified_at
        
        self.creator = {"user_id": creator_id, "full_name": None, "email": None}
        
    def __iter__(self):
        yield from {
            "community_id": self.community_id,
            "title": self.title,
            "description": self.description,
            "membership": self.membership,
            "data_type": self.data_type,
            "status": self.status,
            "creator_id": self.creator_id,
            "created_at": self.created_at,
            "modified_at": self.modified_at
        }.items()
        
    def __str__(self):
        return json.dumps(self.to_json())
    
    def __repr__(self):
        return self.__str__()

    def to_json(self):
        return dict(self)
    
    def to_json_view(self):
        json = dict(self)
        json["creator"] = self.creator
        
        return json
    
    def to_json_update(self):
        return{
            "title": self.title,
            "description": self.description,
            "data_type": self.data_type,
            "status": self.status,
            "modified_at": self.modified_at
        }
    
    @classmethod 
    def from_db_json(cls, json_dict):
        return cls(json_dict["community_id"],
                   json_dict["title"],
                   json_dict["description"],
                   json_dict["membership"],
                   json_dict["data_type"],
                   json_dict["status"],
                   json_dict["creator_id"],
                   json_dict["created_at"],
                   json_dict["modified_at"])
        
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
    
    def to_json(self):
        return asdict(self)
    
    def to_json_update(self):
        return{            
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
    
            