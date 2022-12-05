from typing import Any
from interface import implements
from repository.interfaces.users_broker import IUsersBroker

from injector import inject
from repository.interfaces.config import IDbConfig

import time
from datetime import datetime, timedelta, timezone
from pymongo.results import InsertManyResult

class UsersBroker(implements(IUsersBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
       self.db = config.get_db()
    
    def add_user(self, user: Any):
        usersCollection = self.db["users"]
        if user.get("role") is None:
            user["role"] = "user"

        u = {
            "username": user["uid"],
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "email": user["email"],
            "domain": user["domain"],
            "role": user["role"],
            "created-at": str(datetime.now())
        }

        usersCollection.insert_one(u)
    
    def get_user_by_username(self, username: str):
        usersCollection = self.db["users"]
        uq = {"username": username, "email":{"$exists" : True}}

        return usersCollection.find_one(uq)
    
    def update_user(self, username: str, field: str, value: Any):
        usersCollection = self.db["users"]
        userQuery = {"username": username}

        user = usersCollection.find_one(userQuery)
        if user is None:
            return

        updateParameter = {"$set": {field: value, "modified-at": str(time.time())}}

        usersCollection.update_one({"username": username}, updateParameter)

    
    def delete_user(self, username: str):
        usersCollection = self.db["archive"]
        uq = {"username": username}

        user = usersCollection.delete_many(uq)

        return user is not None
    
    def move_documents(self, sourceCollection: str, targetCollection: str, filter: dict):
        sc = self.db[sourceCollection]
        tc = self.db[targetCollection]
        
        sourceDocs = sc.find(filter)
        result: InsertManyResult = tc.insert_many(sourceDocs, False, True)
        
        r = sc.delete_many({"_id": {"$in": result.inserted_ids}})
        return r.deleted_count
    
    def delete_old_user(self):
        ar = self.db["archive"]
        now = datetime.now(timezone.utc)
        nowMinusThreeWeeks = str(now - timedelta(weeks=3))
        r = ar.delete_many({
            "$or": [
                {"created-at": {"$lt":  nowMinusThreeWeeks}},
                {"revoked-at": {"$lt":  nowMinusThreeWeeks}}
            ]
        })
        return r.deleted_count