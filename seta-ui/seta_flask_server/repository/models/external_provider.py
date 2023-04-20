from dataclasses import dataclass, asdict

@dataclass(kw_only=True)
class ExternalProvider:    
    user_id: str
    provider_uid: str
    provider: str
    first_name: str
    last_name : str
    domain: str

    def to_json(self):
        return asdict(self)
    
    @classmethod 
    def from_db_json(cls, json_dict):
        return cls(user_id=json_dict["user_id"],
                   provider_uid=json_dict["provider_uid"],
                   provider=json_dict["provider"],
                   first_name=json_dict["first_name"],
                   last_name=json_dict["last_name"],
                   domain=json_dict["domain"])