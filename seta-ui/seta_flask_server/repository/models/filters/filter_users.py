from dataclasses import dataclass


@dataclass
class FilterUsers:
    user_type: str = None
    status: str = None
