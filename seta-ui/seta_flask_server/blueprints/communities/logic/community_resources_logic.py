from seta_flask_server.infrastructure.constants import ResourceStatusConstants
from seta_flask_server.infrastructure.scope_constants import ResourceScopeConstants
from seta_flask_server.repository.models import ResourceModel, ResourceLimitsModel, EntityScope

def parse_args_new_resource(creator_id: str, community_id: str, resource_dict: dict) -> (ResourceModel, list[EntityScope]):
    resource_id = resource_dict["resource_id"]

    model = ResourceModel(resource_id=resource_id, 
                        community_id=community_id, 
                        title=resource_dict["title"], 
                        abstract=resource_dict["abstract"],
                        type=resource_dict["type"],
                        status=ResourceStatusConstants.Active,
                        limits = ResourceLimitsModel(), #set default limits
                        creator_id=creator_id)
    
    scopes = [
                EntityScope(user_id=creator_id,  id=resource_id, scope=ResourceScopeConstants.Edit).to_resource_json(),
                EntityScope(user_id=creator_id,  id=resource_id, scope=ResourceScopeConstants.DataAdd).to_resource_json(),
                EntityScope(user_id=creator_id,  id=resource_id, scope=ResourceScopeConstants.DataDelete).to_resource_json()
            ]
    
    return (model, scopes)