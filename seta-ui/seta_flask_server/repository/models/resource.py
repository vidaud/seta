from datetime import datetime
from dataclasses import dataclass, asdict
from .user_info import UserInfo

@dataclass(kw_only=True)
class ResourceLimitsModel:
    total_files_no: int = 50
    total_storage_mb: float = 1024
    file_size_mb: float = 50

    def to_json(self):
        return asdict(self)

    @classmethod 
    def from_db_json(cls, json_dict):
        return cls(total_files_no=json_dict["total_files_no"],
                   total_storage_mb=json_dict["total_storage_mb"],
                   file_size_mb=json_dict["file_size_mb"])

@dataclass 
class ResourceModel:
    resource_id: str = None,
    community_id: str = None,
    title: str = None,
    abstract: str = None,
    limits: ResourceLimitsModel = None,
    status: str = None,
    creator_id: str = None,
    created_at: datetime = None,
    modified_at: datetime = None

    creator: UserInfo = None
    
    def __post_init__(self):
        if self.resource_id:
            self.resource_id = self.resource_id.lower()
        if self.community_id:
            self.community_id = self.community_id.lower()

    def to_json(self):
        json = asdict(self)
        json.pop("creator", None)
        
        return json

    def to_json_update(self):
        return{
            "title": self.title,
            "abstract": self.abstract,
            "status": self.status,
            "modified_at": self.modified_at
        }

    @classmethod 
    def from_db_json(cls, json_dict: dict):
        limits = ResourceLimitsModel.from_db_json(json_dict["limits"])

        return cls(resource_id=json_dict["resource_id"],
                   community_id=json_dict["community_id"],
                   title=json_dict["title"],
                   abstract=json_dict["abstract"],
                   status=json_dict["status"],
                   creator_id=json_dict["creator_id"],
                   created_at=json_dict["created_at"],
                   modified_at=json_dict.get("modified_at"),
                   limits=limits)

@dataclass
class ResourceContributorModel:
    resource_id: str = None,
    user_id: str = None,
    file_name: str = None,
    file_size_mb: float = None,
    metadata: dict = None,
    uploaded_at: datetime = None

    def to_json(self):
        return asdict(self)

    @classmethod 
    def from_db_json(cls, json_dict: dict):
        return cls(resource_id=json_dict["resource_id"],
                   user_id=json_dict["user_id"],
                   file_name=json_dict["file_name"],
                   file_size_mb=json_dict["file_size_mb"],
                   metadata=json_dict["metadata"],
                   uploaded_at=json_dict["uploaded_at"])


@dataclass   
class ResourceChangeRequestModel:
    request_id: str = None
    resource_id: str = None    
    field_name: str = None
    new_value: str = None
    old_value: str = None
    requested_by: str = None
    status: str = None
    initiated_date: datetime = None
    reviewed_by: str = None
    review_date: datetime = None

    requested_by_info: UserInfo = None
    reviewed_by_info: UserInfo = None
    
    def to_json(self):
        json = asdict(self)
        json.pop("requested_by_info", None)
        json.pop("reviewed_by_info", None)

        return json
    
    def to_json_update(self):
        return{            
            "status": self.status,
            "review_date": self.review_date,
            "reviewed_by": self.reviewed_by
        }
        
    @classmethod 
    def from_db_json(cls, json_dict: dict):
        return cls(request_id=json_dict["request_id"],
                   resource_id=json_dict["resource_id"],
                   field_name=json_dict["field_name"],
                   new_value=json_dict["new_value"],
                   old_value=json_dict["old_value"],
                   requested_by=json_dict["requested_by"],
                   status=json_dict["status"],
                   initiated_date=json_dict["initiated_date"],
                   reviewed_by=json_dict.get("reviewed_by"),
                   review_date=json_dict.get("review_date"))