from seta_auth.infrastructure.constants import ResourceScopeConstants, ResourceTypeConstants
from seta_auth.repository.models import SetaUser
from seta_auth.repository.interfaces import IResourcesBroker


def get_resource_permissions(user: SetaUser, resourcesBroker: IResourcesBroker) -> dict:
    permissions = {"add": [], "delete": [], "view": []}

    if user is not None:
        if user.resource_scopes is not None:
            data_add_resources = filter(lambda r: r.scope.lower() == ResourceScopeConstants.DataAdd.lower(), user.resource_scopes)                        
            permissions["add"] = [obj.id for obj in data_add_resources]
            
            data_delete_resources = filter(lambda r: r.scope.lower() == ResourceScopeConstants.DataDelete.lower(), user.resource_scopes)                        
            permissions["delete"] = [obj.id for obj in data_delete_resources]

        #get queryable resource
        permissions["view"] = resourcesBroker.get_all_queryable_by_user_id(user.user_id)        

        #get representative resources
        permissions["representatives"] = resourcesBroker.get_all_by_user_id_and_type(user_id=user.user_id, type=ResourceTypeConstants.Representative)

    return permissions