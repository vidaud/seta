from seta_flask_server.repository.mongo_implementation import DbConfig
from seta_flask_server.repository.models import SetaUser, RsaKey
from flask import current_app, g, json
import datetime
import pytz
from abc import ABC, abstractmethod

class DbTest(ABC):
    def __init__(self) -> None:
        config = DbConfig(current_app=current_app, g=g)
        self.db = config.get_db()

    @abstractmethod
    def init_db(self):
        pass
        
    def clear_db(self):
        for c in self.db.list_collection_names():
            self.db.drop_collection(c)

class DbTestSetaApi(DbTest):
    def __init__(self) -> None:
        super().__init__()

    def init_db(self):
        created_at = datetime.datetime.now(tz=pytz.utc)
        data_path="../tests/infrastructure/data"
             
        with current_app.open_resource(f"{data_path}/users.json") as fp:
            data = json.load(fp)
      
        collection = self.db["users"]
      
        #save users
        for user in data["users"]:          
            su = SetaUser(user_id=user["user_id"], email=user["email"], user_type=user["user_type"], status=user["status"], created_at=created_at)
            collection.insert_one(su.to_json())

            #insert public key
            pub_path = f"{data_path}/{su.user_id}.pub"
            with current_app.open_resource(resource=pub_path) as fk:
                key = fk.read().decode("utf8")
                rk = RsaKey(user_id=su.user_id, rsa_value=key, created_at=created_at)
                collection.insert_one(rk.to_json())

            #current_app.logger.debug("Append user: " + su.user_id)            
        
        #save user claims
        collection.insert_many(data["claims"])
        #save user scopes
        collection.insert_many(data["scopes"])
        #save user providers
        collection.insert_many(data["providers"])
