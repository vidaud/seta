from interface import Interface
from seta_flask_server.repository.models import ExternalProvider

class IExternalProviderBroker(Interface):

    def get_by_user_and_uid(self, user_id: str, provider_uid: str, provider: str) -> ExternalProvider:
        """
        Returns an external provider for user id

        :param user_id:
            Seta User identifier
        :param provider_uid:
            User id in provider
        :param provider:
            Provider name 
        """
        pass

    def get_by_user(self, user_id: str) -> list[ExternalProvider]:
        """
        Returns all external providers for user id

        :param user_id:
            Seta User identifier
        """
        pass