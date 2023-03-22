import json
from pymongo import MongoClient
from pathlib import Path

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
        """
        Initialize test database and its collections
        """
        
            
        created_at = datetime.datetime.now(tz=pytz.utc)
        
        base_path = Path(__file__).parent
        users_file_path="../data/users.json"
        
        users_full_path = (base_path / users_file_path).resolve()
             
        '''
            Load users:
        '''
        
        with open(users_full_path) as fp:
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
            pub_path=f"../data/{user_id}.pub"        
            full_path = (base_path / pub_path).resolve()
            
            with open(full_path, encoding="utf-8") as fk:
                key = fk.read()
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
            
        '''
            Load communities:
        '''
        comm_file_path="../data/communities.json"
        
        comm_full_path = (base_path / comm_file_path).resolve()
        
        with open(comm_full_path) as fp:
            data = json.load(fp)
            
        collection = self.db["communities"]
            
        if "communities" in data:
            for community in data["communities"]:
                community["created_at"] = created_at
                community["modified_at"] = None
                
                collection.insert_one(community)
            
        if "memberships" in data:
            for membership in data["memberships"]:
                membership["join_date"] = created_at
                membership["modified_at"] = None
                
                collection.insert_one(membership)
                
        '''
            Load resources:
        '''
        res_file_path="../data/resources.json"
        
        res_full_path = (base_path / res_file_path).resolve()
        
        with open(res_full_path) as fr:
            data = json.load(fr)
            
        collection = self.db["resources"]
            
        if "resources" in data:
            for resource in data["resources"]:
                resource["created_at"] = created_at
                resource["modified_at"] = None
                
                collection.insert_one(resource)
                
            
        
    def clear_db(self):
        for c in self.db.list_collection_names():
            self.db.drop_collection(c)
