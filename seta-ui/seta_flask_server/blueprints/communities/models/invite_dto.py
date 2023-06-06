from flask_restx import Model, fields
from flask_restx.reqparse import RequestParser

from seta_flask_server.infrastructure.constants import InviteStatusConstants

new_invite_parser = RequestParser(bundle_errors=True)
new_invite_parser.add_argument("email", 
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  action='append',
                                  help="List of registered emails \"email='a@a.a'&email='b@b.b'\"")
new_invite_parser.add_argument("message", 
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  help="Invite message")

update_invite_parser = RequestParser(bundle_errors=True)
update_invite_parser.add_argument("status",
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  case_sensitive=False,
                                  choices=InviteStatusConstants.List,
                                  help=f"Status, one of {InviteStatusConstants.EditList}")

invite_model = Model("Invite",
        {
            "invite_id": fields.String(description="Invite unique identifier"),
            "community_id": fields.String(description="Community identifier"),
            "invited_user": fields.String(description="Invited user identifier"),
            "message": fields.String(description="Sent invite message"),            
            "status": fields.String(description="The invite status", enum=InviteStatusConstants.List),
            "expire_date": fields.DateTime(description="Community join date", attribute="expire_date"),
            "initiated_by": fields.String(description="Sender"),
            "initiated_date": fields.DateTime(description="Send date", attribute="initiated_date")
        })