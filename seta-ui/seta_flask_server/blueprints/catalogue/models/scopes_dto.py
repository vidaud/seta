from flask_restx import Model, fields

scope_model = Model(
    "Scope",
    {
        "code": fields.String(description="Internal code of the scope"),
        "name": fields.String(description="Short name"),
        "description": fields.String(description="Description of the scope"),
        "elevated": fields.Boolean(description="Indicates higher access"),
    },
)

scopes_model = Model(
    "ScopesCatalogue",
    {
        "system": fields.List(
            fields.Nested(model=scope_model), description="List of the systems scopes"
        ),
        "community": fields.List(
            fields.Nested(model=scope_model), description="List of the community scopes"
        ),
        "resource": fields.List(
            fields.Nested(model=scope_model), description="List of the resource scopes"
        ),
    },
)
