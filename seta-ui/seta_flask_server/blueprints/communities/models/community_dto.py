from flask_restx import Model, fields
from flask_restx.reqparse import RequestParser

from seta_flask_server.infrastructure.constants import (
    CommunityStatusConstants,
    CommunityMembershipConstants,
    CommunityRequestFieldConstants,
    RequestStatusConstants,
)

from .models_dto import user_info_model
from .resource_request_dto import change_request_model as resource_change_request_model

new_community_parser = RequestParser(bundle_errors=True)
new_community_parser.add_argument(
    "community_id",
    location="form",
    required=True,
    nullable=False,
    help="Unique community identifier",
)
new_community_parser.add_argument(
    "title", location="form", required=True, nullable=False, help="Short title"
)
new_community_parser.add_argument(
    "description",
    location="form",
    required=True,
    nullable=False,
    help="Relevant information about this community",
)

update_community_parser = new_community_parser.copy()
update_community_parser.remove_argument("community_id")
update_community_parser.add_argument(
    "status",
    location="form",
    required=True,
    nullable=False,
    case_sensitive=False,
    choices=CommunityStatusConstants.List,
    help=f"Status, one of {CommunityStatusConstants.List}",
)


community_model = Model(
    "Community",
    {
        "community_id": fields.String(description="Community identifier"),
        "title": fields.String(description="Community title"),
        "description": fields.String(description="Community relevant description"),
        "membership": fields.String(
            description="The membership status", enum=CommunityMembershipConstants.List
        ),
        "status": fields.String(
            description="The community status", enum=CommunityStatusConstants.List
        ),
        "creator": fields.Nested(
            model=user_info_model, description="Community creator info", skip_none=True
        ),
        "created_at": fields.DateTime(
            description="Creation date", attribute="created_at"
        ),
    },
)

new_change_request_parser = RequestParser(bundle_errors=True)
new_change_request_parser.add_argument(
    "field_name",
    location="form",
    required=True,
    nullable=False,
    case_sensitive=False,
    choices=CommunityRequestFieldConstants.List,
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
    "CommunityChangeRequest",
    {
        "request_id": fields.String(description="Request identifier"),
        "community_id": fields.String(description="Community identifier"),
        "field_name": fields.String(
            description="Requested field", enum=CommunityRequestFieldConstants.List
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

all_change_requests_model = Model(
    "AllChangeRequests",
    {
        "community_change_requests": fields.List(
            fields.Nested(
                change_request_model,
                description="Change requests for community",
                skip_none=True,
            )
        ),
        "resource_change_requests": fields.List(
            fields.Nested(
                resource_change_request_model,
                description="Change requests for resource",
                skip_none=True,
            )
        ),
    },
)

ns_cr_models = {
    user_info_model.name: user_info_model,
    change_request_model.name: change_request_model,
    resource_change_request_model.name: resource_change_request_model,
    all_change_requests_model.name: all_change_requests_model,
}

ns_community_models = {
    user_info_model.name: user_info_model,
    community_model.name: community_model,
}
