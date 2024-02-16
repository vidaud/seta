# pylint: disable=missing-function-docstring
from injector import inject
from interface import implements

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


class CatalogueBroker(implements(ICatalogueBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.db = config.get_db()
        self.collection = self.db["catalogues"]

    def get_scopes(self, category: ScopeCategory = None) -> ScopeCatalogues:
        catalogues = ScopeCatalogues()

        if category is None or category == ScopeCategory.System:
            catalogues.system = [
                CatalogueScope.from_db_json(s)
                for s in self.collection.find({"catalogue": "system-scopes"})
            ]

        if category is None or category == ScopeCategory.DataSource:
            catalogues.resource = [
                CatalogueScope.from_db_json(s)
                for s in self.collection.find({"catalogue": "data-source-scopes"})
            ]

        return catalogues

    def get_roles(self, category: RoleCategory = None) -> RoleCatalogues:
        catalogues = RoleCatalogues()

        if category is None or category == RoleCategory.Application:
            catalogues.application = [
                CatalogueRole.from_db_json(s)
                for s in self.collection.find({"catalogue": "app-roles"})
            ]

        return catalogues

    def get_role(self, code: str) -> CatalogueRole:
        role = self.collection.find_one({"catalogue": "app-roles", "code": code})

        if role is not None:
            return CatalogueRole.from_db_json(role)

        return None

    def get_fields(self) -> list[CatalogueField]:
        fields = self.collection.find({"catalogue": "fields"})
        return [CatalogueField.from_db_json(f) for f in fields]
