from flask_restx import Model, fields
from flask_restx.reqparse import RequestParser

from infrastructure.constants import CommunityStatusConstants, RequestStatusConstants

def status_list(value):
    '''Validation method for status value in list'''    
    value = value.lower()
    
    if value not in CommunityStatusConstants.List:
        raise ValueError(
            "Status has to be one of '" + str(CommunityStatusConstants.List) + "'."
        )
        
    return value

new_membership_parser = RequestParser(bundle_errors=True)
new_membership_parser.add_argument("user_id", 
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help="User identifier")
new_membership_parser.add_argument("role", 
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help="Membership role")
#new_membership_parser.add_argument('membership')
new_membership_parser.add_argument("status",
                                  type=status_list,
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help=f"Status, one of {CommunityStatusConstants.List}")

update_membership_parser = new_membership_parser.copy()
update_membership_parser.remove_argument("user_id")


membership_model = Model("Membership",
        {
            "community_id": fields.String(description="Community identifier"),
            "user_id": fields.String(description="User identifier"),
            "role": fields.String(description="Membership role desription"),
            "join_date": fields.DateTime(description="Community join date", attribute="join_date"),
            "status": fields.String(description="The membership status", enum=CommunityStatusConstants.List)
        })


def request_status_list(value):
    '''Validation method for status value in list'''    
    value = value.lower()
    
    if value not in RequestStatusConstants.EditList:
        raise ValueError(
            "Status has to be one of '" + str(RequestStatusConstants.EditList) + "'."
        )
        
    return value

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