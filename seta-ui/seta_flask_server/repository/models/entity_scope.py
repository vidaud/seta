import json

class EntityScope:
    def __init__(self, user_id, id, scope) -> None:
        self.user_id = user_id
        self.id = id
        self.scope = scope

    def __iter__(self):
        yield from {
            "user_id": self.user_id,
            "id": self.id,
            "scope": self.scope
        }.items()
        
    def __str__(self) -> str:
        return json.dumps(self.to_json())
    
    def __repr__(self) -> str:
        return self.__str__()

    def to_json(self) -> dict:
        return dict(self)

    def to_scope_json(self) -> dict:
        return {"id": self.id, "scope": self.scope}
    
    def to_community_json(self) -> dict:
        return {"user_id": self.user_id, "community_id": self.id, "community_scope": self.scope}
    
    def to_resource_json(self) -> dict:
        return {"user_id": self.user_id, "resource_id": self.id, "resource_scope": self.scope}

    @classmethod
    def community_from_db_json(cls, json_dict):
        return cls(json_dict["user_id"],
                   json_dict["community_id"],
                   json_dict["community_scope"])

    @classmethod
    def resource_from_db_json(cls, json_dict):
        return cls(json_dict["user_id"],
                   json_dict["resource_id"],
                   json_dict["resource_scope"])