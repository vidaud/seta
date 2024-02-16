# pylint: disable=missing-function-docstring

from flask_sqlalchemy import SQLAlchemy
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, IExternalProviderBroker
from seta_flask_server.repository.models import ExternalProvider

from seta_flask_server.repository.orm_models import ExternalProviderOrm


class OrmExternalProviderBroker(implements(IExternalProviderBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.config = config
        self.db: SQLAlchemy = config.get_db()

    def create(self, provider: ExternalProvider):
        orm_provider = to_orm_model(provider)

        self.db.session.add(orm_provider)
        self.db.session.commit()

    def get_by_uid(self, provider_uid: str, provider: str) -> ExternalProvider:
        provider = (
            self.db.session.query(ExternalProviderOrm)
            .filter_by(provider_uid=provider_uid, provider=provider)
            .first()
        )

        if provider is None:
            return None

        return from_orm_model(provider)

    def get_by_user(self, user_id: str) -> list[ExternalProvider]:

        providers = (
            self.db.session.query(ExternalProviderOrm).filter_by(user_id=user_id).all()
        )

        if providers:
            return [from_orm_model(provider) for provider in providers]

        return []


def from_orm_model(provider: ExternalProviderOrm) -> ExternalProvider:
    return ExternalProvider(
        user_id=provider.user_id,
        provider_uid=provider.provider_uid,
        provider=provider.provider,
        first_name=provider.first_name,
        last_name=provider.last_name,
        domain=provider.domain,
    )


def to_orm_model(provider: ExternalProvider) -> ExternalProviderOrm:
    return ExternalProviderOrm(
        user_id=provider.user_id,
        provider_uid=provider.provider_uid,
        provider=provider.provider,
        first_name=provider.first_name,
        last_name=provider.last_name,
        domain=provider.domain,
    )
