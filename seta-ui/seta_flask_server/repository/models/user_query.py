import json

class UserQuery:
    
    def __init__(self, user_id, query_key, query_value, created_at = None, modified_at = None):
        self.user_id = user_id
        self.query_key = query_key
        self.query_value = query_value
        self.created_at = created_at
        self.modified_at = modified_at
        
    def __iter__(self):
        yield from {
            "user_id": self.user_id,
            "query_key": self.query_key,
            "query_value": self.query_value,
            "created_at": self.created_at,
            "modified_at": self.modified_at
        }.items()
        
    def __str__(self):
        return json.dumps(self.to_json())
    
    def __repr__(self):
        return self.__str__()

    def to_json(self):
        return dict(self)