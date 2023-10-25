# pylint: disable=missing-function-docstring
from dataclasses import dataclass


@dataclass
class CatalogueField:
    name: str
    description: str

    @classmethod
    def from_db_json(cls, json_dict: dict):
        return cls(name=json_dict["name"], description=json_dict["description"])
