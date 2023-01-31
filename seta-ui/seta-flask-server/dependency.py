import flask
import injector

import repository.interfaces as interfaces
import repository.mongo_implementation as implementation
#from flask_injector import request

class MongoDbClientModule(injector.Module):

    def configure(self, binder):
        binder.bind(interfaces.IDbConfig, to=self.create_client)
        binder.bind(interfaces.IRsaKeysBroker, to=implementation.RsaKeysBroker)
        binder.bind(interfaces.IStatesBroker, to=implementation.StatesBroker)
        binder.bind(interfaces.IUsersBroker, to=implementation.UsersBroker)
        binder.bind(interfaces.ICommunitiesBroker, to=implementation.CommunitiesBroker)
        binder.bind(interfaces.IMembershipsBroker, to=implementation.MembershipsBroker)
        binder.bind(interfaces.IResourcesBroker, to=implementation.ResourcesBroker)
        binder.bind(interfaces.ICommunityChangeRequestsBroker, to=implementation.CommunityChangeRequestsBroker)     
                
    def create_client(
            self
    ) -> interfaces.IDbConfig:
        app = flask.current_app
        g = flask.g
        
        app.logger.debug("create_client")        
        return implementation.DbConfig(current_app=app, g=g)