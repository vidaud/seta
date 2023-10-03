from flask_restx import Model, fields
from flask_restx.reqparse import RequestParser

from seta_flask_server.infrastructure.scope_constants import SystemScopeConstants
from seta_flask_server.infrastructure.constants import UserStatusConstants, UserRoleConstants, ExternalProviderConstants

from seta_flask_server.blueprints.profile.models.scopes_dto import (system_scope_model, community_scopes_model, resource_scopes_model, user_scopes_model)

status_parser = RequestParser(bundle_errors=True)
status_parser.add_argument("status",
                            location="args",
                            required=False,
                            case_sensitive=False,
                            choices=UserStatusConstants.List,
                            help=f"User status")

update_status_parser = RequestParser(bundle_errors=True)
update_status_parser.add_argument("status",
                            location="json",
                            required=True,
                            case_sensitive=False,
                            choices=UserStatusConstants.List,
                            help=f"New account status")

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
                    "lastModifiedAt": fields.DateTime(description="Last modified date"),
                    "externalProviders": fields.List(fields.Nested(provider_model), description="External providers"),
                    "details": fields.Nested(account_details_model, description="Account details"),
                    "scopes": fields.Nested(user_scopes_model, description="User scopes", skip_none=True)
                })

permissions_model = Model("UserPermissions", 
                {
                    "role": fields.String(description="User role", enum=[r.lower() for r in UserRoleConstants.List]),
                    "scopes": fields.List(fields.String(enum=SystemScopeConstants.List), description="System scopes")
                })

ns_models = {}
ns_models[system_scope_model.name] = system_scope_model
ns_models[community_scopes_model.name] = community_scopes_model
ns_models[resource_scopes_model.name] = resource_scopes_model
ns_models[user_scopes_model.name] = user_scopes_model

ns_models[user_info_model.name] = user_info_model
ns_models[provider_model.name] = provider_model
ns_models[account_details_model.name] = account_details_model
ns_models[account_model.name] = account_model
ns_models[permissions_model.name] = permissions_model