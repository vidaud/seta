from flask import json

class MembershipModel:
    def __init__(self, community_id, user_id, role = None, join_date = None, status = None, modified_at = None) -> None:
        self.community_id = community_id
        self.user_id = user_id
        self.role = role
        self.join_date = join_date
        self.status = status
        self.modified_at = modified_at
        
    def __iter__(self):
        yield from {
            "community_id": self.community_id,
            "user_id": self.user_id,
            "role": self.role,
            "join_date": self.join_date,
            "status": self.status,
            "modified_at": self.modified_at
        }.items()
        
    def __str__(self):
        return json.dumps(self.to_json())
    
    def __repr__(self):
        return self.__str__()

    def to_json(self):
        return dict(self)
    
    def to_json_update(self):
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
        
class MembershipRequestModel:
    def __init__(self, community_id, requested_by, message = None, status = None, initiated_date = None, reviewed_by = None, review_date = None) -> None:
        self.community_id = community_id
        self.requested_by = requested_by
        self.message = message        
        self.status = status
        self.initiated_date = initiated_date
        self.reviewed_by = reviewed_by
        self.review_date = review_date
        
    def __iter__(self):
        yield from {
            "community_id": self.community_id,
            "requested_by": self.requested_by,
            "message": self.message,
            "status": self.status,
            "initiated_date": self.initiated_date,
            "reviewed_by": self.reviewed_by,
            "review_date": self.review_date
        }.items()
        
    def __str__(self):
        return json.dumps(self.to_json())
    
    def __repr__(self):
        return self.__str__()

    def to_json(self):
        return dict(self)
    
    def to_json_update(self):
        return{            
            "status": self.status,
            "review_date": self.review_date,
            "reviewed_by": self.reviewed_by
        }
    
    @classmethod 
    def from_db_json(cls, json_dict):
        return cls(community_id=json_dict["community_id"],
                   requested_by=json_dict["requested_by"],
                   message=json_dict["message"],
                   status=json_dict["status"],
                   initiated_date=json_dict["initiated_date"],
                   reviewed_by=json_dict["reviewed_by"],
                   review_date=json_dict["review_date"])        