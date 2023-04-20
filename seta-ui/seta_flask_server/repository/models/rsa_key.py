from datetime import datetime
from dataclasses import dataclass, asdict

@dataclass
class RsaKey:
    
    user_id: str
    rsa_value: str
    created_at: datetime = None
    modified_at:datetime = None

    def to_json(self):
        return asdict(self)