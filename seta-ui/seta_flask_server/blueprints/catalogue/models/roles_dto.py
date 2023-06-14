from flask_restx import Model, fields

role_model = Model("Role",{
                    "code": fields.String(description="Internal code of the role"),
                    "name": fields.String(description="Short name"),
                    "description": fields.String(description="Description of the role"),
                    "default_scopes": fields.List(fields.String(), description="List of the default scopes for this role")
                })

roles_model = Model("ScopesCatalgoue", {
    "application": fields.List(fields.Nested(model=role_model), description="List of the application roles"),
    "community": fields.List(fields.Nested(model=role_model), description="List of the community roles")
})