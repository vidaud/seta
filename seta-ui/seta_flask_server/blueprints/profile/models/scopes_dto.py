from flask_restx import Model, fields

system_scope_model = Model(
    "SystemScope",
    {
        "area": fields.String(description="Application area"),
        "scope": fields.String(description="System scope"),
    },
)

data_source_scopes_model = Model(
    "DataSourceScopes",
    {
        "data_source_id": fields.String(description="Identifier"),
        "scopes": fields.List(fields.String(), description="Scopes"),
    },
)

user_scopes_model = Model(
    "UserScopeList",
    {
        "system_scopes": fields.List(
            fields.Nested(
                model=system_scope_model, description="System scopes", skip_none=True
            )
        ),
        "data_source_scopes": fields.List(
            fields.Nested(
                model=data_source_scopes_model,
                skip_none=True,
            ),
            description="Data source scopes",
        ),
    },
)
