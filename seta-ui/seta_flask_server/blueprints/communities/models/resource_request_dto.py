from flask_restx import Model, fields
from flask_restx.reqparse import RequestParser

from seta_flask_server.infrastructure.constants import (
    RequestStatusConstants,
    ResourceRequestFieldConstants,
)

from .models_dto import user_info_model

new_change_request_parser = RequestParser(bundle_errors=True)

new_change_request_parser.add_argument(
    "field_name",
    location="form",
    required=True,
    nullable=False,
    case_sensitive=False,
    choices=ResourceRequestFieldConstants.List,
    help="Requested field name",
)

new_change_request_parser.add_argument(
    "new_value",
    location="form",
    required=True,
    nullable=False,
    help="New value for field",
)

new_change_request_parser.add_argument(
    "old_value",
    location="form",
    required=True,
    nullable=False,
    help="Current value at request",
)

change_request_model = Model(
    "ResourceChangeRequest",
    {
        "request_id": fields.String(description="Request identifier"),
        "resource_id": fields.String(description="Resource identifier"),
        "field_name": fields.String(
            description="Requested field", enum=ResourceRequestFieldConstants.List
        ),
        "new_value": fields.String(description="New value for field"),
        "old_value": fields.String(description="Current value at request"),
        "requested_by": fields.String(
            description="User identifier that initiated the request"
        ),
        "requested_by_info": fields.Nested(
            model=user_info_model, description="Requested by"
        ),
        "status": fields.String(
            description="Request status", enum=RequestStatusConstants.List
        ),
        "initiated_date": fields.DateTime(
            description="Request initiated date", attribute="initiated_date"
        ),
        "reviewed_by": fields.String(
            description="User identifier that reviewed the request"
        ),
        "reviewed_by_info": fields.Nested(
            model=user_info_model, description="Reviewed by", skip_none=True
        ),
        "review_date": fields.DateTime(
            description="Reviewed date", attribute="review_date"
        ),
    },
)

ns_models = {
    user_info_model.name: user_info_model,
    change_request_model.name: change_request_model,
}
