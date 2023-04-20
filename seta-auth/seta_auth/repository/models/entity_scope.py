from dataclasses import dataclass, asdict

@dataclass(kw_only=True)
class EntityScope:
    user_id: str
    id: str
    scope: str

    def to_json(self) -> dict:
        return asdict(self)

    def to_scope_json(self) -> dict:
        return {"id": self.id, "scope": self.scope}
    
    def to_community_json(self) -> dict:
        return {"user_id": self.user_id, "community_id": self.id, "community_scope": self.scope}
    
    def to_resource_json(self) -> dict:
        return {"user_id": self.user_id, "resource_id": self.id, "resource_scope": self.scope}

    @classmethod
    def community_from_db_json(cls, json_dict):
        return cls(user_id=json_dict["user_id"],
                   id=json_dict["community_id"],
                   scope=json_dict["community_scope"])

    @classmethod
    def resource_from_db_json(cls, json_dict):
        return cls(user_id=json_dict["user_id"],
                   id=json_dict["resource_id"],
                   scope=json_dict["resource_scope"])