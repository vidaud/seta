from interface import Interface

from seta_flask_server.repository.models import (
    ScopeCatalogues,
    ScopeCategory,
    RoleCatalogues,
    RoleCategory,
    CatalogueRole,
    CatalogueField,
)


class ICatalogueBroker(Interface):
    def get_scopes(self, category: ScopeCategory = None) -> ScopeCatalogues:
        """Get catalogue of scopes.

        Args:
            category:
                Optional, filter scope list by category, one of: 'system', 'community', 'scope'.
                None means no filter, return all entries.

        Returns:
            Scopes grouped by category: system, community and resource.
        """
        pass

    def get_roles(self, category: RoleCategory = None) -> RoleCatalogues:
        """Account roles.

        Args:
            category:
                Optional, filter scope list by category, one of: 'application', 'community'.
                None means no filter, return all entries.

        Returns:
            Roles grouped by category: application and category
        """
        pass

    def get_role(self, code: str) -> CatalogueRole:
        """Role by code.

        Args:
            code: Role code, one of CommunityRoleConstants.

        Returns:
            Found role or None.
        """

        pass

    def get_fields(self) -> list[CatalogueField]:
        """Document fields."""
        pass
