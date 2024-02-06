from interface import Interface
from seta_flask_server.repository.models import ExternalProvider


class IExternalProviderBroker(Interface):

    def create(self, provider: ExternalProvider):
        """Create new external provider.

        Args:
            provider: External provider to create.

        Returns:
            Created external provider.
        """
        pass

    def get_by_uid(self, provider_uid: str, provider: str) -> ExternalProvider:
        """External provider by external identifier and provider.

        Args:
            provider_uid: User id in provider.
            provider:  Provider name.

        Returns:
            Found entry in the database or None.
        """
        pass

    def get_by_user(self, user_id: str) -> list[ExternalProvider]:
        """All external providers for user identifier.

        Args:
            user_id: Seta User identifier.

        Returns:
            List of external providers for authentication of this local account.
            Empty list if no provider found.
        """
        pass
