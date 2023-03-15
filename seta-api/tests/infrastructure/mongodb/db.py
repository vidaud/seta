from flask import current_app, g, json
from pymongo import MongoClient

import datetime
import pytz


class DbTestSetaApi:
    def __init__(self, db_host:str, db_port:int, db_name: str) -> None:
        self.db_host = db_host
        self.db_port = db_port
        self.db_name = db_name
        
        client = MongoClient(self.db_host, self.db_port)
        self.db = client[self.db_name] 

    def init_db(self):        
        created_at = datetime.datetime.now(tz=pytz.utc)
        data_path="../tests/infrastructure/data"
             
        with current_app.open_resource(f"{data_path}/users.json") as fp:
            data = json.load(fp)
      
        collection = self.db["users"]
      
        #save users
        for user in data["users"]:          
            user_id = user["user_id"]
            
            cnt = collection.count_documents({"user_id": user_id})
            if cnt > 0:
                continue
            
            collection.insert_one({"user_id": user_id, 
                                   "email": user["email"], 
                                   "user_type": user["user_type"], 
                                   "status": user["status"], 
                                   "created_at": created_at})

            #insert public key
            pub_path = f"{data_path}/{user_id}.pub"
            with current_app.open_resource(resource=pub_path) as fk:
                key = fk.read().decode("utf8")
                collection.insert_one({"user_id": user_id, "rsa_value": key, "created_at": created_at})

            #current_app.logger.debug("Append user: " + su.user_id)            
        
        #save user claims
        if "claims" in data:
            collection.insert_many(data["claims"])
        #save user scopes
        if "scopes" in data:
            collection.insert_many(data["scopes"])
        #save user providers
        if "providers" in data:
            collection.insert_many(data["providers"])
        
    def clear_db(self):
        for c in self.db.list_collection_names():
            self.db.drop_collection(c)
