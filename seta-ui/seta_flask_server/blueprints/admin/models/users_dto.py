from flask_restx import Model, fields
from flask_restx.reqparse import RequestParser
from seta_flask_server.infrastructure.constants import UserStatusConstants, UserRoleConstants

from seta_flask_server.blueprints.profile.models.info_dto import provider_model, account_model

user_info_model = Model("UserInfo", 
                {
                    "username": fields.String(description="Internal SETA user identifier"),
                    "fullName": fields.String(description="User full name"),
                    "email": fields.String(description="User email address"),
                    "role": fields.String(description="User role", enum=UserRoleConstants.List),
                    "status": fields.String(description="Account status", enum=UserStatusConstants.List)
                })

status_parser = RequestParser(bundle_errors=True)
status_parser.add_argument("status",
                                  location="args",
                                  required=False,
                                  case_sensitive=False,
                                  choices=UserStatusConstants.List,
                                  help=f"User status")