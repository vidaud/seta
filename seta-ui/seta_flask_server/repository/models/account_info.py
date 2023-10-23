from dataclasses import dataclass
from datetime import datetime


@dataclass(kw_only=True)
class AccountInfo:
    user_id: str = None
    has_rsa_key: bool = False
    applications_count: int = 0
    last_active: datetime = None
