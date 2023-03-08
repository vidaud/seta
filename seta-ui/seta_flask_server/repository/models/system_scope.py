from flask import json

class SystemScope:
    def __init__(self, user_id, scope, area) -> None:
        self.user_id = user_id
        self.area = area
        self.scope = scope

    def __iter__(self):
        yield from {
            "user_id": self.user_id,            
            "system_scope": self.scope,
            "area": self.area
        }.items()
        
    def __str__(self) -> str:
        return json.dumps(self.to_json())
    
    def __repr__(self) -> str:
        return self.__str__()

    def to_json(self) -> dict:
        return dict(self)

    @classmethod 
    def from_db_json(cls, json_dict):
        return cls(json_dict["user_id"],
                   json_dict["system_scope"],
                   json_dict["area"])