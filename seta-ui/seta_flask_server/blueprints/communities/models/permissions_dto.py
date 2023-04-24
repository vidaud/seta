from flask_restx import Model, fields
from flask_restx.reqparse import RequestParser

from seta_flask_server.infrastructure.scope_constants import CommunityScopeConstants, ResourceScopeConstants

user_scope_model = Model("User Scope", {
    "user_id": fields.String(description="User identifier"),    
    "scope": fields.String(description="Scope")
})

def community_scope_list(value):
    '''Validation method for scope value in list'''    
    value = value.lower()
    
    if value not in CommunityScopeConstants.EditList:
        raise ValueError(
            "Community scope has to be one of '" + str(CommunityScopeConstants.EditList) + "'."
        )
        
    return value

community_scopes_parser = RequestParser(bundle_errors=True)
community_scopes_parser.add_argument("scope", 
                                  location="form",
                                  required=True,
                                  nullable=False,
                                  type=community_scope_list,
                                  action='append',
                                  help=f"Scopes list, any of {CommunityScopeConstants.EditList}")