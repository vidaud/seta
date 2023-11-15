from seta_flask_server.repository.models import EntityScope


def validate_new_app_scopes(
    parent_scopes: list[EntityScope], resource_scopes: list[dict]
) -> bool:
    """Check if any of scope is outside parent permissions"""

    if not resource_scopes:
        return True

    if not parent_scopes and resource_scopes:
        return False

    for resource_scope in resource_scopes:
        resource_id = resource_scope["resourceId"]
        scopes = resource_scope["scopes"]

        if scopes:
            for scope in scopes:
                if not any(
                    ps.id.lower() == resource_id.lower()
                    and ps.scope.lower() == scope.lower()
                    for ps in parent_scopes
                ):
                    raise ValueError(
                        f"Resource scope('{resource_id}', '{scope}') outside parent permissions!"
                    )

    return True
