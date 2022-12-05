import json

class ExternalProvider:
    
    def __init__(self, user_id, provider_uid, provider, first_name, last_name, domain) -> None:
        self.user_id = user_id
        self.provider_uid = provider_uid
        self.provider = provider
        self.first_name = first_name
        self.last_name = last_name
        self.domain = domain
        
    def __iter__(self):
        yield from {
            "user_id": self.user_id,
            "provider_uid": self.provider_uid,
            "provider": self.provider,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "domain": self.domain
        }.items()
        
    def __str__(self):
        return json.dumps(self.to_json())
    
    def __repr__(self):
        return self.__str__()

    def to_json(self):
        return dict(self)