# pylint: disable=missing-function-docstring
from flask_sqlalchemy import SQLAlchemy
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, IUserPermissionsBroker
from seta_flask_server.repository.models import SystemScope
from seta_flask_server.repository.orm_models import SystemScopeOrm


class OrmUserPermissionsBroker(implements(IUserPermissionsBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.config = config
        self.db: SQLAlchemy = config.get_db()

    def get_all_user_system_scopes(self, user_id: str) -> list[SystemScope]:

        scopes = self.db.session.query(SystemScopeOrm).filter_by(user_id=user_id).all()

        if scopes:
            return [from_orm_model(scope) for scope in scopes]

        return []

    def replace_all_user_system_scopes(
        self, user_id: str, scopes: list[SystemScope]
    ) -> None:
        self.db.session.query(SystemScopeOrm).filter_by(user_id=user_id).delete()
        self.db.session.add_all([to_orm_model(scope) for scope in scopes])

        self.db.session.commit()


def from_orm_model(scope: SystemScopeOrm) -> SystemScope:
    return SystemScope(
        user_id=scope.user_id,
        system_scope=scope.scope,
        area=scope.area,
    )


def to_orm_model(scope: SystemScope) -> SystemScopeOrm:
    return SystemScopeOrm(
        user_id=scope.user_id,
        scope=scope.system_scope,
        area=scope.area,
    )
