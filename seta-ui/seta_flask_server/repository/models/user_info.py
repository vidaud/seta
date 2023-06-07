from dataclasses import dataclass, asdict

@dataclass
class UserInfo:
    user_id: str = None
    full_name: str = None
    email: str = None

    def to_json(self) -> dict:
        return asdict(self)