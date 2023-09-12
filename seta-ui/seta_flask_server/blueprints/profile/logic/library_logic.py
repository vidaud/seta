from datetime import datetime
import pytz
from seta_flask_server.repository.models import LibraryItem, LibraryItemType
from seta_flask_server.repository.interfaces.library_broker import ILibraryBroker

def parse_args_new_library_items(user_id: str, data: list[dict]) -> list[LibraryItem]:
    now = datetime.now(tz=pytz.utc)

    library_items = []
        
    for item in data:
        id = LibraryItem.generate_uuid()

        library_item = LibraryItem(user_id=user_id, 
                                id=id, 
                                title=item["title"],
                                parent_id=item.get("parentId", None),
                                type=item["type"],
                                document_id=item.get("documentId", None),
                                link=item.get("link", None),
                                created_at=now)
        
        library_items.append(library_item)

    return library_items

def parse_args_update_library_item(item: LibraryItem, args: dict):
    item.parent_id = args["parentId"]
    item.title = args["title"]
    item.type = args["type"]
    item.document_id = args["documentId"]
    item.link = args["link"]
    item.modified_at = datetime.now(tz=pytz.utc)


def get_library_tree(user_id: str, libraryBroker: ILibraryBroker) -> dict:
    library_items = {"items": []}
    library_items["items"] = build_library_tree(user_id=user_id, libraryBroker=libraryBroker)

    return library_items

def build_library_tree(user_id: str, libraryBroker: ILibraryBroker, parent: dict = None) -> list[dict]:
    parent_id = None

    if parent is not None:
        parent_id = parent["id"]

    items = libraryBroker.get_all_by_parent(user_id=user_id, parent_id=parent_id)
    
    library_items = []

    for item in items:
        lib_item = {
            "id": item.id,
            "title": item.title,
            "parent_id": parent_id,
            "type": item.type
        }

        #construct the path for this item   

        if parent is not None:      
            item_path = parent["path"].copy()
        else:
            item_path = []
        item_path.append(item.title)

        lib_item["path"] = item_path

        if item.type == LibraryItemType.Document:
            lib_item["document_id"] = item.document_id
            lib_item["link"] = item.link

        library_items.append(lib_item)

        if item.type == LibraryItemType.Folder:
            lib_item["children"] = build_library_tree(user_id=user_id, libraryBroker=libraryBroker, parent = lib_item)


    return library_items