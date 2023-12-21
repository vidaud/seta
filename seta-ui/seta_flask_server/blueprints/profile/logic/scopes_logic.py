from seta_flask_server.repository.models import SetaUser
from seta_flask_server.repository.models.data_source.data_source_scope import (
    DataSourceScopeModel,
)


def build_user_scopes(user: SetaUser) -> dict:
    """Group user scopes in dictionary."""

    user_scopes = {
        "system_scopes": None,
        "data_source_scopes": None,
    }

    if user.system_scopes:
        user_scopes["system_scopes"] = []

        for scope in user.system_scopes:
            user_scopes["system_scopes"].append(
                {"area": scope.area, "scope": scope.system_scope}
            )

    if user.data_source_scopes:
        user_scopes["data_source_scopes"] = group_scopes(
            scopes=user.data_source_scopes, id_field="data_source_id"
        )

    return user_scopes


def group_scopes(scopes: list[DataSourceScopeModel], id_field: str) -> list[dict]:
    """Group scopes by identifier."""

    scope_list = []
    for scope in scopes:
        entry = next(
            (us for us in scope_list if us[id_field] == scope.data_source_id), None
        )

        if entry:
            entry["scopes"].append(scope.scope)
        else:
            scope_list.append({id_field: scope.data_source_id, "scopes": [scope.scope]})

    return scope_list
