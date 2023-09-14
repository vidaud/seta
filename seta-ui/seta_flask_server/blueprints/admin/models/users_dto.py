from flask_restx import Model, fields
from flask_restx.reqparse import RequestParser
from seta_flask_server.infrastructure.constants import UserStatusConstants, UserRoleConstants, ExternalProviderConstants

status_parser = RequestParser(bundle_errors=True)
status_parser.add_argument("status",
                                  location="args",
                                  required=False,
                                  case_sensitive=False,
                                  choices=UserStatusConstants.List,
                                  help=f"User status")

user_info_model = Model("UserInfo", 
                {
                    "username": fields.String(description="Internal SETA user identifier"),
                    "fullName": fields.String(description="User full name"),
                    "email": fields.String(description="User email address"),
                    "role": fields.String(description="User role", enum=UserRoleConstants.List),
                    "status": fields.String(description="Account status", enum=UserStatusConstants.List)
                })

provider_model = Model("ExternalProvider",
                       {
                           "providerUid": fields.String(description="External username"),
                           "provider": fields.String(description="External provider", enum=ExternalProviderConstants.List),
                           "firstName": fields.String(description="User first name"),
                           "lastName": fields.String(description="User last name")
                       })

account_details_model = Model("AccountDetails", 
                {               
                    "hasRsaKey": fields.Boolean(description="Has public RSA key"),                    
                    "appsCount": fields.Integer(description="Number of applications"),
                    "lastActive": fields.DateTime(description="Last login datetime")
                }) 

account_model = Model("AccountInfo", 
                {
                    "username": fields.String(description="Internal SETA user identifier"),                  
                    "email": fields.String(description="User email address"),                    
                    "role": fields.String(description="User role", enum=UserRoleConstants.List),
                    "status": fields.String(description="Account status", enum=UserStatusConstants.List),
                    "createdAt": fields.DateTime(description="Created date"),
                    "externalProviders": fields.List(fields.Nested(provider_model), description="External providers"),
                    "details": fields.Nested(account_details_model, description="Account details")
                })

