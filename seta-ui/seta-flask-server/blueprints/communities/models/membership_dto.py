from flask_restx import Model, fields
from flask_restx.reqparse import RequestParser

from infrastructure.constants import CommunityStatusConstants, RequestStatusConstants
from .models_dto import status_list, request_status_list

update_membership_parser = RequestParser(bundle_errors=True)
update_membership_parser.add_argument("role", 
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help="Membership role")
update_membership_parser.add_argument("status",
                                  type=status_list,
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help=f"Status, one of {CommunityStatusConstants.List}")


membership_model = Model("Membership",
        {
            "community_id": fields.String(description="Community identifier"),
            "user_id": fields.String(description="User identifier"),
            "role": fields.String(description="Membership role desription"),
            "join_date": fields.DateTime(description="Community join date", attribute="join_date"),
            "status": fields.String(description="The membership status", enum=CommunityStatusConstants.List)
        })

new_request_parser = RequestParser(bundle_errors=True)
new_request_parser.add_argument("message", 
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help="Request message")


update_request_parser = RequestParser(bundle_errors=True)
update_request_parser.add_argument("status",
                                  type=request_status_list,
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help=f"Status, one of {RequestStatusConstants.EditList}")

request_model = Model("MembershipRequest",
        {
            "community_id": fields.String(description="Community identifier"),
            "requested_by": fields.String(description="User identifier"),
            "message": fields.String(description="Request message"),
            "initiated_date": fields.DateTime(description="Community join date", attribute="initiated_date"),
            "status": fields.String(description="The request status", enum=RequestStatusConstants.List),
            "reviewed_by": fields.String(description="Review user identifier"),
            "review_date": fields.DateTime(description="Reviewed on", attribute="review_date"),
        })