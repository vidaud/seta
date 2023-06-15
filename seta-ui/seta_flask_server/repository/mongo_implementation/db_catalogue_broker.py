from injector import inject
from interface import implements

from seta_flask_server.repository.interfaces import IDbConfig, ICatalogueBroker
from seta_flask_server.repository.models import ScopeCatalogues, ScopeCategory, RoleCatalogues, RoleCategory, CatalogueScope, CatalogueRole

class CatalogueBroker(implements(ICatalogueBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
       self.db = config.get_db()
       self.collection = self.db["catalogues"]

    def get_scopes(self, category: ScopeCategory = None) -> ScopeCatalogues:
        catalogues = ScopeCatalogues()

        if category is None or category == ScopeCategory.System:
            catalogues.system = [CatalogueScope.from_db_json(s) for s in self.collection.find({"catalogue": "system-scopes"})]

        if category is None or category == ScopeCategory.Community:
            catalogues.community = [CatalogueScope.from_db_json(s) for s in self.collection.find({"catalogue": "community-scopes"})]

        if category is None or category == ScopeCategory.Resource:
            catalogues.resource = [CatalogueScope.from_db_json(s) for s in self.collection.find({"catalogue": "resource-scopes"})]

        return catalogues

    def get_roles(self, category: RoleCategory = None) -> RoleCatalogues:
        catalogues = RoleCatalogues()
        
        if category is None or category == RoleCategory.Application:
            catalogues.application = [CatalogueRole.from_db_json(s) for s in self.collection.find({"catalogue": "app-roles"})]

        if category is None or category == RoleCategory.Community:
            catalogues.community = [CatalogueRole.from_db_json(s) for s in self.collection.find({"catalogue": "community-roles"})]

        return catalogues