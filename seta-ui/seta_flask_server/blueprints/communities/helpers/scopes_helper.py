from seta_flask_server.repository.models import EntityScope
from seta_flask_server.repository.interfaces import IUsersBroker

def create_user_scopes(scopes: list[EntityScope], usersBroker: IUsersBroker) -> list[dict]:
    user_scopes = []
    for scope in scopes:
        entry = next((us for us in user_scopes if us["user_id"] == scope.user_id), None)

        if entry:
            entry["scopes"].append(scope.scope)
        else:
            entry = {"user_id": scope.user_id, "user_info": None, "scopes": [scope.scope]}
            user_info = usersBroker.get_user_by_id(user_id=scope.user_id, load_scopes=False)
            if user_info:
                entry["user_info"] = user_info.user_info
            
            user_scopes.append(entry)

    return user_scopes