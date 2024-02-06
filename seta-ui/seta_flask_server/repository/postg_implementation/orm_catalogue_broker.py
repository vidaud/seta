# pylint: disable=missing-function-docstring

from flask_sqlalchemy import SQLAlchemy
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, ICatalogueBroker
from seta_flask_server.repository.models import (
    ScopeCatalogues,
    ScopeCategory,
    CatalogueScope,
    RoleCatalogues,
    RoleCategory,
    CatalogueRole,
    CatalogueField,
)

from seta_flask_server.repository.orm_models import (
    CatalogueScopeOrm,
    CatalogueRoleOrm,
    CatalogueFieldOrm,
)


class OrmCatalogueBroker(implements(ICatalogueBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.config = config
        self.db: SQLAlchemy = config.get_db()

    def get_scopes(self, category: ScopeCategory = None) -> ScopeCatalogues:
        catalogues = ScopeCatalogues()

        if category is None or category == ScopeCategory.System:

            scopes = (
                self.db.session.query(CatalogueScopeOrm).filter_by(area="system").all()
            )

            if scopes:
                catalogues.system = [from_scope_orm_model(s) for s in scopes]
            else:
                catalogues.system = []

        if category is None or category == ScopeCategory.DataSource:

            scopes = (
                self.db.session.query(CatalogueScopeOrm)
                .filter_by(area="data-sources")
                .all()
            )

            if scopes:
                catalogues.resource = [from_scope_orm_model(s) for s in scopes]
            else:
                catalogues.resource = []

        return catalogues

    def get_roles(self, category: RoleCategory = None) -> RoleCatalogues:
        catalogues = RoleCatalogues()

        if category is None or category == RoleCategory.Application:
            roles = self.db.session.query(CatalogueRoleOrm).all()

            if roles:
                catalogues.application = [from_role_orm_model(r) for r in roles]
            else:
                catalogues.application = []

        return catalogues

    def get_role(self, code: str) -> CatalogueRole:
        role = self.db.session.query(CatalogueRoleOrm).filter_by(code=code).first()

        if role is not None:
            return from_role_orm_model(role)

        return None

    def get_fields(self) -> list[CatalogueField]:
        fields = self.db.session.query(CatalogueFieldOrm).all()

        if fields:
            return [from_field_orm_model(f) for f in fields]

        return []


def from_scope_orm_model(scope: CatalogueScopeOrm) -> CatalogueScope:
    return CatalogueScope(
        code=scope.code,
        name=scope.name,
        description=scope.description,
        elevated=scope.elevated,
    )


def from_role_orm_model(role: CatalogueRoleOrm) -> CatalogueRole:
    return CatalogueRole(
        code=role.code,
        name=role.name,
        description=role.description,
        default_scopes=role.default_scopes,
    )


def from_field_orm_model(field: CatalogueFieldOrm) -> CatalogueField:
    return CatalogueField(
        name=field.name,
        description=field.description,
    )
