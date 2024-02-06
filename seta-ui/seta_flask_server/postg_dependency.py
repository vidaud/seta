"""Dependency injection for repository brokers"""

import flask
import injector

from seta_flask_server.repository import interfaces
import seta_flask_server.repository.postg_implementation as implementation


class PostgresDbClientModule(injector.Module):
    """Configure injector bindings"""

    def configure(self, binder):
        binder.bind(interfaces.IDbConfig, to=self.create_client)

        binder.bind(interfaces.IRsaKeysBroker, to=implementation.OrmRsaKeysBroker)
        binder.bind(interfaces.IUsersBroker, to=implementation.OrmUsersBroker)
        binder.bind(
            interfaces.IUserPermissionsBroker,
            to=implementation.OrmUserPermissionsBroker,
        )
        binder.bind(interfaces.ISessionsBroker, to=implementation.OrmSessionsBroker)
        binder.bind(interfaces.IAppsBroker, to=implementation.OrmAppsBroker)
        binder.bind(interfaces.ICatalogueBroker, to=implementation.OrmCatalogueBroker)

        binder.bind(interfaces.ILibraryBroker, to=implementation.OrmLibraryBroker)
        binder.bind(interfaces.IUsersQueryBroker, to=implementation.OrmUsersQueryBroker)
        binder.bind(
            interfaces.IExternalProviderBroker,
            to=implementation.OrmExternalProviderBroker,
        )

        binder.bind(
            interfaces.IDataSourcesBroker, to=implementation.OrmDataSourcesBroker
        )
        binder.bind(
            interfaces.IAnnotationsBroker, to=implementation.OrmAnnotationsBroker
        )
        binder.bind(
            interfaces.IDataSourceScopesBroker,
            to=implementation.OrmDataSourceScopesBroker,
        )
        binder.bind(
            interfaces.ISearchIndexesBroker, to=implementation.OrmSearchIndexesBroker
        )
        binder.bind(
            interfaces.IUserProfileUnsearchables,
            to=implementation.OrmUserProfileUnsearchablesBroker,
        )

    def create_client(self) -> interfaces.IDbConfig:
        """Create configuration client"""

        app = flask.current_app
        g = flask.g

        return implementation.OrmConfig(current_app=app, g=g)
