from seta_flask_server.repository.models import EntityScope, SetaUser

def build_user_scopes(user: SetaUser) -> dict:
    user_scopes = {
        "system_scopes": None,
        "community_scopes": None,
        "resource_scopes": None
    }

    if user.system_scopes and len(user.system_scopes) > 0:
        user_scopes["system_scopes"] = []

        for scope in user.system_scopes:
            user_scopes["system_scopes"].append({"area": scope.area, "scope": scope.system_scope})

    if user.community_scopes and len(user.community_scopes) > 0:        
        user_scopes["community_scopes"] = _group_entity_scopes(scopes=user.community_scopes, id_field="community_id")

    if user.resource_scopes and len(user.resource_scopes) > 0:
        user_scopes["resource_scopes"] = _group_entity_scopes(scopes=user.resource_scopes, id_field="resource_id")
    
    return user_scopes

def _group_entity_scopes(scopes: list[EntityScope], id_field: str) -> list[dict]:
    scope_list = []
    for scope in scopes:
        entry = next((us for us in scope_list if us[id_field] == scope.id), None)

        if entry:
            entry["scopes"].append(scope.scope)
        else:           
            scope_list.append({id_field: scope.id, "scopes": [scope.scope]})

    return scope_list