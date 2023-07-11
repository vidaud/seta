from interface import Interface

from seta_flask_server.repository.models import ScopeCatalogues, ScopeCategory, RoleCatalogues, RoleCategory, CatalogueRole


class ICatalogueBroker(Interface):

    def get_scopes(self, category: ScopeCategory = None) -> ScopeCatalogues:
        """
        Get catalogue of scopes

        :param category:
            Optional, filter scope list by category, one of: 'system', 'community', 'scope'
            None means no filter, return all entries

        """
        pass

    def get_roles(self, category: RoleCategory = None) -> RoleCatalogues:
        """
        Get catalogue of role

        :param category:
            Optional, filter scope list by category, one of: 'application', 'community'
            None means no filter, return all entries
        """
        pass

    def get_role(self, code: str) -> CatalogueRole:

        """
        Get catalogue entry for a role

        :param code:
            Role code, one of CommunityRoleConstants
        """

        pass