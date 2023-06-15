from dataclasses import dataclass, field
from enum import Enum

@dataclass
class CatalogueRole:
    code: str
    name: str
    description: str
    default_scopes: list[str] = field(default_factory=list)

    @classmethod
    def from_db_json(cls, json_dict: dict):
        return cls(code=json_dict["code"],
                   name=json_dict["name"],
                   description=json_dict["description"],
                   default_scopes = json_dict.get("default_scopes", []))
    

@dataclass
class RoleCatalogues:
    application: list[CatalogueRole] = None
    community: list[CatalogueRole] = None

class RoleCategory(Enum):
    Application = "application"
    Community = "community"

    def __str__(self):
        return str(self.value)

