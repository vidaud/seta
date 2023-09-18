from seta_flask_server.repository.models.library import LibraryItemType
from flask_restx import Model, fields
from flask_restx.reqparse import RequestParser
from seta_flask_server.infrastructure.helpers import NullableString

library_model = Model("LibraryItem",
                  {
                      "id": NullableString(description="Item Identifier"),
                      "title": fields.String(description="Title"),
                      "parentId": NullableString(description="Parent identifier"),
                      "type": fields.Integer(description="Item type; 0 - Folder, 1 - Document"),
                      "path": fields.List(fields.String, description="Path array of titles"),
                      "documentId": NullableString(description="Document Identifier"),
                      "link": NullableString(description="External link")
                  })

library_model["children"] = fields.List(fields.Nested(model=library_model, skip_none=True), description="Child items")

library_items = Model("LibraryItems",
                      {
                          "items": fields.List(fields.Nested(model=library_model, skip_none=True))
                      })

update_item_parser = RequestParser(bundle_errors=True)
update_item_parser.add_argument("title",
                            location="json",
                            required=True,
                            nullable=False,
                            help="Title")
update_item_parser.add_argument("parentId",
                            location="json",
                            required=False,                                
                            nullable=True,
                            help="Parent identifier")
update_item_parser.add_argument("documentId",
                            location="json",
                            required=False,                                
                            nullable=True,
                            help="Document id")
update_item_parser.add_argument("link",
                            location="json",
                            required=False,                                
                            nullable=True,
                            help="Link")