import json
import typing as t

from flask import json as flask_json
from flask_restx import Model, fields
from flask_restx.reqparse import RequestParser


class FileMetadata(fields.Raw):
    __schema_format__ = "json"
    __schema_type__ = "json"

    def format(self, value):
        return value


contributor_model = Model(
    "Resource Contributor",
    {
        "resource_id": fields.String(description="Resource identifier"),
        "user_id": fields.String(description="Contributor identifier"),
        "file_name": fields.String(description="Uploaded file name"),
        "file_size_mb": fields.Float(description="File size in MB"),
        "metadata": FileMetadata(attribute="metadata", description="File metadata"),
        "uploaded_at": fields.DateTime(
            description="File upload date", attribute="uploaded_at"
        ),
    },
)


def _metadata(value) -> t.Any:
    """Deserialize metadata as JSON."""

    try:
        return flask_json.loads(value)
    except json.JSONDecodeError as err:
        raise ValueError("Metadata has to be a valid json") from err


new_contributor_parser = RequestParser(bundle_errors=True)
new_contributor_parser.add_argument(
    "file_name",
    location="form",
    required=True,
    nullable=False,
    help="Uploaded file name",
)
new_contributor_parser.add_argument(
    "file_size_mb",
    location="form",
    type=float,
    required=True,
    nullable=False,
    help="File size in MB",
)
new_contributor_parser.add_argument(
    "metadata",
    type=_metadata,
    location="form",
    required=True,
    nullable=False,
    help="File metadata as json",
)
