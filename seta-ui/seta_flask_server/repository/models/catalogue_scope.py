from dataclasses import dataclass
from enum import Enum


@dataclass
class CatalogueScope:
    code: str
    name: str
    description: str
    elevated: bool = False

    @classmethod
    def from_db_json(cls, json_dict: dict):
        return cls(code=json_dict["code"],
                   name=json_dict["name"],
                   description=json_dict["description"],
                   elevated = json_dict.get("elevated", False))
    

@dataclass
class ScopeCatalogues:
    system: list[CatalogueScope] = None
    community: list[CatalogueScope] = None
    resource: list[CatalogueScope] = None

class ScopeCategory(Enum):
    System = 'system'
    Community = 'community'
    Resource = 'resource'

    def __str__(self):
        return str(self.value)

