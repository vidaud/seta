"""Dependency injection for repository brokers"""

import flask
import injector

from seta_flask_server.repository import interfaces
import seta_flask_server.repository.mongo_implementation as implementation


class MongoDbClientModule(injector.Module):
    """Configure injector bindings"""

    def configure(self, binder):
        binder.bind(interfaces.IDbConfig, to=self.create_client)
        binder.bind(interfaces.IRsaKeysBroker, to=implementation.RsaKeysBroker)
        binder.bind(interfaces.IUsersBroker, to=implementation.UsersBroker)
        binder.bind(interfaces.ICommunitiesBroker, to=implementation.CommunitiesBroker)
        binder.bind(interfaces.IMembershipsBroker, to=implementation.MembershipsBroker)
        binder.bind(
            interfaces.ICommunityChangeRequestsBroker,
            to=implementation.CommunityChangeRequestsBroker,
        )
        binder.bind(
            interfaces.ICommunityInvitesBroker, to=implementation.CommunityInvitesBroker
        )
        binder.bind(interfaces.IResourcesBroker, to=implementation.ResourcesBroker)
        binder.bind(
            interfaces.IResourceChangeRequestsBroker,
            to=implementation.ResourceChangeRequestsBroker,
        )
        binder.bind(
            interfaces.IUserPermissionsBroker, to=implementation.UserPermissionsBroker
        )
        binder.bind(interfaces.ISessionsBroker, to=implementation.SessionsBroker)
        binder.bind(interfaces.IAppsBroker, to=implementation.AppsBroker)
        binder.bind(interfaces.IUserProfile, to=implementation.UserProfile)
        binder.bind(interfaces.ICatalogueBroker, to=implementation.CatalogueBroker)
        binder.bind(
            interfaces.INotificationsBroker, to=implementation.NotificationsBroker
        )
        binder.bind(interfaces.IStatsBroker, to=implementation.StatsBroker)
        binder.bind(interfaces.ILibraryBroker, to=implementation.LibraryBroker)
        binder.bind(interfaces.IUsersQueryBroker, to=implementation.UsersQueryBroker)
        binder.bind(
            interfaces.IExternalProviderBroker, to=implementation.ExternalProviderBroker
        )
        binder.bind(
            interfaces.IRollingIndexBroker, to=implementation.RollingIndexBroker
        )

        binder.bind(interfaces.IDataSourcesBroker, to=implementation.DataSourcesBroker)
        binder.bind(interfaces.IAnnotationsBroker, to=implementation.AnnotationsBroker)
        binder.bind(
            interfaces.IDataSourceScopesBroker, to=implementation.DataSourceScopesBroker
        )
        binder.bind(
            interfaces.ISearchIndexesBroker, to=implementation.SearchIndexesBroker
        )
        binder.bind(
            interfaces.IUserProfileUnsearchables,
            to=implementation.UserProfileUnsearchables,
        )

    def create_client(self) -> interfaces.IDbConfig:
        """Create configuration client"""

        app = flask.current_app
        g = flask.g

        # app.logger.debug("create_client")
        return implementation.DbConfig(current_app=app, g=g)
