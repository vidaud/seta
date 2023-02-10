from repository.mongo_implementation import DbConfig
from repository.models import SetaUser
from flask import current_app, g, json
import datetime
import pytz

class DbTest:
    def __init__(self) -> None:
        config = DbConfig(current_app=current_app, g=g)
        self.db = config.get_db()
        self.private_keys={}     
        
    def init_db(self):
        created_at = datetime.datetime.now(tz=pytz.utc)  
             
        with current_app.open_resource("data/users.json") as fp:
            data = json.load(fp)
      
        collection = self.db["users"]
      
        #save users
        for user in data["users"]:          
            su = SetaUser(user_id=user["user_id"], email=user["email"], user_type=user["user_type"], status=user["status"], created_at=created_at)
            collection.insert_one(su.to_json())
          
            #read private key
            with current_app.open_resource(f"data/{su.user_id}.key") as fk:
                self.private_keys[su.user_id] = fk.read()
        
        #save user claims
        collection.insert_many(data["claims"])
        #save user scopes
        collection.insert_many(data["scopes"])
        #save user providers
        collection.insert_many(data["providers"])
        #save user rsa_keys
        collection.insert_many(data["rsa_keys"])
        
    def clear_db(self):
        for c in self.db.list_collection_names():
            self.db.drop_collection(c)
              
     
    
           