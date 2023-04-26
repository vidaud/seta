import flask
import injector

import seta_auth.repository.interfaces as interfaces
import seta_auth.repository.mongo_implementation as implementation

class MongoDbClientModule(injector.Module):

    def configure(self, binder):
        binder.bind(interfaces.IDbConfig, to=self.create_client)
        binder.bind(interfaces.IRsaKeysBroker, to=implementation.RsaKeysBroker)
        binder.bind(interfaces.IUsersBroker, to=implementation.UsersBroker)
        binder.bind(interfaces.IResourcesBroker, to=implementation.ResourcesBroker)
        binder.bind(interfaces.IUserPermissionsBroker, to=implementation.UserPermissionsBroker)
        binder.bind(interfaces.ISessionsBroker, to=implementation.SessionsBroker)
                
    def create_client(
            self
    ) -> interfaces.IDbConfig:
        app = flask.current_app
        g = flask.g
        
        #app.logger.debug("create_client")        
        return implementation.DbConfig(current_app=app, g=g)