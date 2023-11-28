from seta_flask_server.infrastructure.constants import ResourceTypeConstants
from seta_flask_server.infrastructure.scope_constants import ResourceScopeConstants
from seta_flask_server.repository.models import SetaUser
from seta_flask_server.repository.interfaces import (
    IResourcesBroker,
    IRollingIndexBroker,
)


def get_resource_permissions(
    user: SetaUser,
    resources_broker: IResourcesBroker,
    rolling_index_broker: IRollingIndexBroker,
) -> dict:
    """Build resource permissions."""

    permissions = {"add": [], "delete": [], "view": []}

    if user is not None:
        if user.resource_scopes is not None:
            data_add_resources = filter(
                lambda r: r.scope.lower() == ResourceScopeConstants.DataAdd.lower(),
                user.resource_scopes,
            )
            permissions["add"] = []
            for scope in data_add_resources:
                active_index_name = rolling_index_broker.get_active_index_for_resource(
                    resource_id=scope.id
                )
                add_perm = {
                    "community_id": None,
                    "resource_id": scope.id,
                    "indexes": [active_index_name],
                }

                resource = resources_broker.get_by_id(resource_id=scope.id)
                if resource is not None and resource.limits is not None:
                    add_perm["limits"] = resource.limits.to_json()

                permissions["add"].append(add_perm)

            data_delete_resources = filter(
                lambda r: r.scope.lower() == ResourceScopeConstants.DataDelete.lower(),
                user.resource_scopes,
            )
            permissions["delete"] = []
            for scope in data_delete_resources:
                storage_indexes = rolling_index_broker.get_storage_indexes_for_resource(
                    resource_id=scope.id
                )

                permissions["delete"].append(
                    {
                        "community_id": None,
                        "resource_id": scope.id,
                        "indexes": list(storage_indexes),
                    }
                )

        # get queryable resource
        queryable_resources = resources_broker.get_all_queryable_by_user_id(
            user.user_id
        )
        permissions["view"] = []
        for qr in queryable_resources:
            storage_indexes = rolling_index_broker.get_storage_indexes_for_resource(
                resource_id=qr.resource_id
            )

            permissions["view"].append(
                {
                    "community_id": qr.community_id,
                    "resource_id": qr.resource_id,
                    "indexes": list(storage_indexes),
                }
            )

        # get representative resources
        representatives = resources_broker.get_all_by_member_id_and_type(
            user_id=user.user_id, resource_type=ResourceTypeConstants.Representative
        )
        permissions["representatives"] = [
            {"community_id": r.community_id, "resource_id": r.resource_id}
            for r in representatives
        ]

    return permissions
