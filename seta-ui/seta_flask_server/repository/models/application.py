from dataclasses import dataclass, asdict
from .seta_user import SetaUser

@dataclass(kw_only=True)
class SetaApplication: 
    user_id: str = None  
    app_name: str    
    app_description: str = None
    parent_user_id: str
   
    #user object
    user: SetaUser = None    
    #parent user object
    parent_user: SetaUser = None
    
    def __post_init__(self):
        if self.app_name:
            self.app_name = self.app_name.lower()
    
    @property
    def status(self):
        if self.user:
            return self.user.status
        return 'unknown'

    def to_json(self) -> dict:
        json = asdict(self)
        json.pop("user", None)
        json.pop("parent_user", None)
        
        return json
    
    @classmethod 
    def from_db_json(cls, json_dict):
        return cls(user_id=json_dict["user_id"],
                   app_name=json_dict["app_name"],
                   app_description=json_dict["app_description"],
                   parent_user_id=json_dict["parent_user_id"])