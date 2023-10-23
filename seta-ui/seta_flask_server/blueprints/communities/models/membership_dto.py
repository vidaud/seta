from flask_restx import Model, fields
from flask_restx.reqparse import RequestParser

from seta_flask_server.infrastructure.constants import (
    CommunityStatusConstants,
    RequestStatusConstants,
    CommunityRoleConstants,
)
from .models_dto import user_info_model

update_membership_parser = RequestParser(bundle_errors=True)

update_membership_parser.add_argument(
    "role",
    location="form",
    required=True,
    nullable=False,
    case_sensitive=False,
    choices=CommunityRoleConstants.List,
    help="Membership role",
)

update_membership_parser.add_argument(
    "status",
    location="form",
    required=True,
    nullable=False,
    case_sensitive=False,
    choices=CommunityStatusConstants.List,
    help="Membership status",
)


membership_model = Model(
    "Membership",
    {
        "community_id": fields.String(description="Community identifier"),
        "user_id": fields.String(description="User identifier"),
        "user_info": fields.Nested(model=user_info_model),
        "role": fields.String(
            description="Membership role description", enum=CommunityRoleConstants.List
        ),
        "join_date": fields.DateTime(
            description="Community join date", attribute="join_date"
        ),
        "status": fields.String(
            description="The membership status", enum=CommunityStatusConstants.List
        ),
    },
)

new_request_parser = RequestParser(bundle_errors=True)
new_request_parser.add_argument(
    "message", location="form", required=True, nullable=False, help="Request message"
)


update_request_parser = RequestParser(bundle_errors=True)
update_request_parser.add_argument(
    "status",
    location="form",
    required=True,
    nullable=False,
    case_sensitive=False,
    choices=RequestStatusConstants.EditList,
    help="Request status",
)

request_model = Model(
    "MembershipRequest",
    {
        "community_id": fields.String(description="Community identifier"),
        "requested_by": fields.String(description="Requested by identifier"),
        "requested_by_info": fields.Nested(
            model=user_info_model, description="Requested by", skip_none=True
        ),
        "message": fields.String(description="Request message"),
        "initiated_date": fields.DateTime(
            description="Community join date", attribute="initiated_date"
        ),
        "status": fields.String(
            description="The request status", enum=RequestStatusConstants.List
        ),
        "reviewed_by": fields.String(description="Reviewed by identifier"),
        "reviewed_by_info": fields.Nested(
            model=user_info_model, description="Reviewed by", skip_none=True
        ),
        "review_date": fields.DateTime(description="Reviewed on"),
        "reject_timeout": fields.DateTime(
            description="Timeout end date in case of rejection"
        ),
    },
)

request_ns_models = {
    user_info_model.name: user_info_model,
    request_model.name: request_model,
}

membership_ns_models = {
    user_info_model.name: user_info_model,
    membership_model.name: membership_model,
}

my_membership_ns_models = {
    user_info_model.name: user_info_model,
    membership_model.name: membership_model,
    request_model.name: request_model,
}
