from flask_restx import Model, fields
from seta_flask_server.infrastructure.constants import (UserRoleConstants, ExternalProviderConstants)

provider_model = Model("ExternalProvider",
                       {
                           "provider_uid": fields.String(description="External username"),
                           "provider": fields.String(description="External provider", enum=ExternalProviderConstants.List),
                           "firstName": fields.String(description="User first name"),
                           "lastName": fields.String(description="User last name"),
                       })

application_model = Model("Application",
                          {
                              "name": fields.String(description="Application name"),
                              "description": fields.String(description="Application description")
                          })

account_model = Model("AccountInfo", 
                {
                    "username": fields.String(description="Internal SETA user identifier"),                  
                    "email": fields.String(description="User email address"),                    
                    "role": fields.String(description="User role", enum=UserRoleConstants.List),
                    "external_providers": fields.List(fields.Nested(provider_model)),
                    "applications": fields.List(fields.Nested(application_model))
                })

user_info_model = Model("UserInfo", 
                {
                    "username": fields.String(description="Internal SETA user identifier"),
                    "firstName": fields.String(description="User first name"),
                    "lastName": fields.String(description="User last name"),
                    "email": fields.String(description="User email address"),
                    "role": fields.String(description="User role", enum=UserRoleConstants.List)
                })