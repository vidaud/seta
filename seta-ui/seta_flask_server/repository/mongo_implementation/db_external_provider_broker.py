# pylint: disable=missing-function-docstring
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, IExternalProviderBroker
from seta_flask_server.repository.models import ExternalProvider


class ExternalProviderBroker(implements(IExternalProviderBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.config = config
        self.db = config.get_db()
        self.collection = self.db["users"]

    def get_by_uid(self, provider_uid: str, provider: str) -> ExternalProvider:
        provider = self.collection.find_one(
            {"provider_uid": provider_uid, "provider": provider}
        )

        if provider is None:
            return None

        return ExternalProvider.from_db_json(provider)

    def get_by_user(self, user_id: str) -> list[ExternalProvider]:
        user_providers = []

        providers = self.collection.find(
            {"user_id": user_id, "provider": {"$exists": True}}
        )

        for provider in providers:
            user_providers.append(ExternalProvider.from_db_json(provider))

        return user_providers
