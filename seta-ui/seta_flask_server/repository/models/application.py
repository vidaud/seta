from dataclasses import dataclass, asdict

@dataclass(kw_only=True)
class SetaApplication: 
    user_id: str   
    app_name: str    
    app_description: str
    parent_user_id: str

    def to_json(self) -> dict:
        return asdict(self)
    
    @classmethod 
    def from_db_json(cls, json_dict):
        return cls(user_id=json_dict["user_id"],
                   app_name=json_dict["app_name"],
                   app_description=json_dict["app_description"],
                   parent_user_id=json_dict["parent_user_id"])