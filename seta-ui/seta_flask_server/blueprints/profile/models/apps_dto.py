from flask_restx import Model, fields

from seta_flask_server.infrastructure.constants import UserStatusConstants
from seta_flask_server.infrastructure.scope_constants import ResourceScopeConstants

app_model = Model(
    "AppInfo",
    {
        "user_id": fields.String(description="User Identifier"),
        "name": fields.String(description="Application name", attribute="app_name"),
        "description": fields.String(
            description="Application description", attribute="app_description"
        ),
        "status": fields.String(
            "Status", enum=[UserStatusConstants.Active, UserStatusConstants.Disabled]
        ),
    },
)

new_app_model = Model(
    "NewApplication",
    {
        "name": fields.String(description="Application name", required=True),
        "description": fields.String(
            description="Application description", required=True
        ),
        "copyPublicKey": fields.Boolean(
            description="Copy the public key from parent to the new application?",
            default=False,
        ),
        "copyResourceScopes": fields.Boolean(
            description="Copy the resource scopes from parent to the new application?",
            default=False,
        ),
    },
)

update_app_model = Model(
    "UpdateApplication",
    {
        "new_name": fields.String(description="Updated application name"),
        "description": fields.String(
            description="Application description", required=True
        ),
        "status": fields.String(
            "Status",
            required=False,
            enum=[UserStatusConstants.Active, UserStatusConstants.Disabled],
        ),
    },
)

application_scopes_model = Model(
    "ApplicationScopes",
    {
        "resourceId": fields.String(description="Resource identifier", required=True),
        "scopes": fields.List(
            fields.String(description="Scopes", enum=ResourceScopeConstants.List)
        ),
    },
)

application_scopes_details_model = application_scopes_model.clone(
    "ApplicationScopesDetail",
    {
        "communityId": fields.String(description="Community identifier"),
        "title": fields.String(description="Resource title"),
    },
)

ns_models = {
    app_model.name: app_model,
    new_app_model.name: new_app_model,
    update_app_model.name: update_app_model,
    application_scopes_model.name: application_scopes_model,
    application_scopes_details_model.name: application_scopes_details_model,
}
