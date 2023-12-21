# pylint: disable=missing-function-docstring
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, IUserPermissionsBroker
from seta_flask_server.repository.models import SystemScope


class UserPermissionsBroker(implements(IUserPermissionsBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.db = config.get_db()
        self.collection = self.db["users"]

    def get_all_user_system_scopes(self, user_id: str) -> list[SystemScope]:
        system_scopes = []

        scopes = self.collection.find(
            {
                "user_id": user_id,
                "system_scope": {"$exists": True},
                "area": {"$exists": True},
            }
        )

        for scope in scopes:
            system_scopes.append(SystemScope.from_db_json(scope))

        return system_scopes

    def replace_all_user_system_scopes(
        self, user_id: str, scopes: list[SystemScope]
    ) -> None:
        scope_list = [s.to_json() for s in scopes]

        with self.db.client.start_session(causal_consistency=True) as session:
            # delete existing system scopes
            self.collection.delete_many(
                {"user_id": user_id, "system_scope": {"$exists": True}}, session=session
            )
            # insert new scopes
            if scope_list:
                self.collection.insert_many(scope_list, session=session)
