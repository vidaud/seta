from attr import field
from flask_restx import Model, fields

from seta_flask_server.infrastructure.scope_constants import CommunityScopeConstants, ResourceScopeConstants, SystemScopeConstants

system_scope_model = Model("SystemScope", {
    "area": fields.String(description="Application area"),
    "scope": fields.String(description="System scope", enum=SystemScopeConstants.List)
})

community_scopes_model = Model("CommunityScopes",{
    "community_id": fields.String(description="Identifier"),
     "scopes": fields.List(fields.String(description="Scope", enum=CommunityScopeConstants.List))
})

resource_scopes_model = Model("ResourceScopes",{
    "community_id": fields.String(description="Identifier"),
    "scopes": fields.List(fields.String(description="Scope", enum=ResourceScopeConstants.List))
})

user_scopes_model = Model("UserScopeList", {
    "system_scopes": fields.List(fields.Nested(model=system_scope_model, description="System scopes", skip_none=True)),
    "community_scopes": fields.List(fields.Nested(model=community_scopes_model, description="Community scopes", skip_none=True)),
    "resource_scopes":  fields.List(fields.Nested(model=resource_scopes_model, description="Resource scopes", skip_none=True))
})
