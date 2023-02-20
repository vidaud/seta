from flask_restx import Model, fields
from flask_restx.reqparse import RequestParser

from seta_flask_server.infrastructure.constants import InviteStatusConstants


def invite_status_list(value):
    '''Validation method for status value in list'''    
    value = value.lower()
    
    if value not in InviteStatusConstants.EditList:
        raise ValueError(
            "Status has to be one of '" + str(InviteStatusConstants.EditList) + "'."
        )
        
    return value

new_invite_parser = RequestParser(bundle_errors=True)
new_invite_parser.add_argument("emails", 
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  action='split',
                                  help="Registered email coma separated list")
new_invite_parser.add_argument("message", 
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help="Invite message")

update_invite_parser = RequestParser(bundle_errors=True)
update_invite_parser.add_argument("status",
                                  type=invite_status_list,
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help=f"Status, one of {InviteStatusConstants.EditList}")

invite_model = Model("Invite",
        {
            "invite_id": fields.String(description="Invite unique identifier"),
            "community_id": fields.String(description="Community identifier"),
            "invited_user": fields.String(description="Invited user identifier"),
            "message": fields.String(description="Sent invite message"),            
            "status": fields.String(description="The invite status", enum=InviteStatusConstants.List),
            "expire_date": fields.DateTime(description="Community join date", attribute="expire_date"),
            "initiated_by": fields.String(description="Sender user identifier"),
            "initiated_date": fields.DateTime(description="Send date", attribute="initiated_date")
        })