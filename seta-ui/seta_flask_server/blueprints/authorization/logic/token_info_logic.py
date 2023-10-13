from seta_flask_server.infrastructure.constants import ResourceTypeConstants
from seta_flask_server.infrastructure.scope_constants import ResourceScopeConstants
from seta_flask_server.repository.models import SetaUser
from seta_flask_server.repository.interfaces import IResourcesBroker


def get_resource_permissions(user: SetaUser, resourcesBroker: IResourcesBroker) -> dict:
    permissions = {"add": [], "delete": [], "view": []}

    if user is not None:
        if user.resource_scopes is not None:            
            data_add_resources = filter(lambda r: r.scope.lower() == ResourceScopeConstants.DataAdd.lower(), user.resource_scopes)                        
            permissions["add"] = [{ "community_id": None, "resource_id": obj.id } for obj in data_add_resources]
            
            data_delete_resources = filter(lambda r: r.scope.lower() == ResourceScopeConstants.DataDelete.lower(), user.resource_scopes)                        
            permissions["delete"] = [{ "community_id": None, "resource_id": obj.id } for obj in data_delete_resources]

        #get queryable resource
        queryable_resources = resourcesBroker.get_all_queryable_by_user_id(user.user_id)
        permissions["view"] = [{ "community_id": qr.community_id, "resource_id": qr.resource_id } for qr in queryable_resources]

        #get representative resources
        representatives = resourcesBroker.get_all_by_member_id_and_type(user_id=user.user_id, type=ResourceTypeConstants.Representative)
        permissions["representatives"] = [{ "community_id": r.community_id, "resource_id": r.resource_id } for r in representatives]

    return permissions