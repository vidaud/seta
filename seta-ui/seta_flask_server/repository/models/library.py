from enum import IntEnum
from dataclasses import dataclass, asdict
from datetime import datetime
import shortuuid

class LibraryItemType(IntEnum):
    Folder = 0
    Document = 1    

@dataclass
class LibraryItem:
    user_id: str
    id: str    
    title: str
    parent_id: str
    type: LibraryItemType
    document_id: str = None
    link: str = None,
    created_at: datetime = None
    modified_at: datetime = None

    def to_json(self) -> dict:
        json = asdict(self)

        if(self.type == LibraryItemType.Folder):
            del json["document_id"]
            del json["link"]
        
        return json
    
    def to_json_api(self) -> dict:
        json = {
            "id": self.id,
            "title": self.title,
            "parentId": self.parent_id,
            "type": self.type
        }

        if self.type == LibraryItemType.Document:
            json["documentId"] = self.document_id
            json["link"] = self.link

        return json
    
    @classmethod 
    def from_db_json(cls, json_dict: dict):
        return cls(user_id=json_dict["user_id"],
                  id=json_dict["id"],
                  title=json_dict["title"],
                  parent_id=json_dict["parent_id"],
                  type=json_dict["type"],
                  document_id=json_dict.get("document_id", None),
                  link=json_dict.get("link", None),
                  created_at=json_dict.get("created_at", None),
                  modified_at=json_dict.get("modified_at", None)
                  )
                  
    
    @staticmethod
    def generate_uuid() -> str:
        return shortuuid.ShortUUID().random(length=12)
