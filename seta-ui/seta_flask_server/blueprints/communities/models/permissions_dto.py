from flask_restx import Model, fields
from flask_restx.reqparse import RequestParser

from seta_flask_server.infrastructure.scope_constants import (
    CommunityScopeConstants,
    ResourceScopeConstants,
)

from .models_dto import user_info_model

user_scopes_model = Model(
    "User Scope",
    {
        "user_id": fields.String(description="User identifier"),
        "user_info": fields.Nested(
            model=user_info_model, description="User info", skip_none=True
        ),
        "scopes": fields.List(fields.String(description="Scope")),
    },
)

community_scopes_parser = RequestParser(bundle_errors=True)
community_scopes_parser.add_argument(
    "scope",
    location="form",
    required=False,
    action="append",
    case_sensitive=False,
    choices=CommunityScopeConstants.EditList,
    help="Community scopes, a list of " + str(CommunityScopeConstants.EditList),
)


def resource_scope_list(value):
    """Validation method for scope value in list"""
    value = value.lower()

    if value not in ResourceScopeConstants.EditList:
        raise ValueError(
            "Resource scope has to be one of '"
            + str(ResourceScopeConstants.EditList)
            + "'."
        )

    return value


resource_scopes_parser = RequestParser(bundle_errors=True)
resource_scopes_parser.add_argument(
    "scope",
    location="form",
    required=False,
    action="append",
    case_sensitive=False,
    choices=ResourceScopeConstants.EditList,
    help=f"Resource scopes list, a list of {str(ResourceScopeConstants.EditList)}",
)

ns_models = {
    user_info_model.name: user_info_model,
    user_scopes_model.name: user_scopes_model,
}
