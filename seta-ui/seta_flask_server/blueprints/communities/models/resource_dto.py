from flask_restx import Model, fields
from flask_restx.reqparse import RequestParser

from seta_flask_server.infrastructure.constants import (ResourceStatusConstants)

new_resource_parser = RequestParser(bundle_errors=True)
new_resource_parser.add_argument("resource_id",
                                  location="form", 
                                  required=True,
                                  nullable=False,                                  
                                  help="Unique resource identifier")
new_resource_parser.add_argument("title", 
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help="Short title")
new_resource_parser.add_argument("abstract", 
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help="Relevand information about this resource")

update_resource_parser = new_resource_parser.copy()
update_resource_parser.remove_argument("resource_id")
update_resource_parser.add_argument("status",
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  case_sensitive=False,
                                  choices=ResourceStatusConstants.List,
                                  help=f"Status, one of {ResourceStatusConstants.List}")

resource_limits_model = Model("ResourceLimits", 
                {
                    "total_files_no": fields.Integer(description="Total number of files to upload for the resource"),
                    "total_storage_mb": fields.Float(description="Total storage in megabytes"),
                    "file_size_mb": fields.Float(description="File size limit in megabytes")
                })

resource_model = Model("Resource",
        {
            "resource_id": fields.String(description="Resource identifier"),
            "community_id": fields.String(description="Community identifier"),
            "title": fields.String(description="Resource title"),
            "abstract": fields.String(description="Resource relevant description"),
            "limits": fields.Nested(model=resource_limits_model, description="The resource upload limits"),
            "status": fields.String(description="The resource status", enum=ResourceStatusConstants.List),
            "creator_id": fields.String(description="Creator user identifier"),
            "created_at": fields.DateTime(description="Creation date", attribute="created_at")
        })