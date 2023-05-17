from flask_restx import Model, fields, inputs
from flask_restx.reqparse import RequestParser
from seta_flask_server.infrastructure.constants import UserStatusConstants

app_model = Model("AppInfo",
                  {
                      "user_id": fields.String(description="User Identifier"),
                      "name": fields.String(description="Application name", attribute="app_name"),
                      "description": fields.String(description="Application description", attribute="app_description"),
                      "status": fields.String("Status", enum=UserStatusConstants.List)
                  })

new_app_parser = RequestParser(bundle_errors=True)
new_app_parser.add_argument("name",
                            location="form", 
                            required=True,   
                            nullable=False,                             
                            help="Application name")
new_app_parser.add_argument("description",
                            location="form", 
                            required=False,            
                            nullable=True,                  
                            help="Application description")
new_app_parser.add_argument("copy_public_key",
                            type=inputs.boolean,
                            default="false",
                            location="form", 
                            required=True,                                 
                            help="Copy the public key from parent to the new application?")
new_app_parser.add_argument("copy_resource_scopes",
                            type=inputs.boolean,
                            default="true",
                            location="form", 
                            required=True,                                 
                            help="Copy the resource scopes from parent to the new application?")

update_app_parser = RequestParser(bundle_errors=True)
update_app_parser.add_argument("new_name",
                            location="form", 
                            required=False,
                            nullable=False,
                            help="New name for the application")
update_app_parser.add_argument("description",
                            location="form", 
                            required=False,                                
                            nullable=True,
                            help="Application description")
update_app_parser.add_argument("status",
                            location="form", 
                            required=False,
                            choices=UserStatusConstants.List,
                            help="Status")