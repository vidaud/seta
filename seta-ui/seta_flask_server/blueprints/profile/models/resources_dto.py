from flask_restx import Model, fields
from flask_restx.reqparse import RequestParser

resource_model = Model(
    "Resource",
    {
        "resource_id": fields.String(description="Resource identifier"),
        "community_id": fields.String(description="Community identifier"),
        "title": fields.String(description="Resource title"),
    },
)


resources_parser = RequestParser(bundle_errors=True)
resources_parser.add_argument(
    "resource",
    location="form",
    required=False,
    action="append",
    case_sensitive=False,
    help="List of restricted resource ids",
)
