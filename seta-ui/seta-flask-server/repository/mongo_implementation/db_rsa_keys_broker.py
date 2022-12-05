from typing import Any
from interface import implements

from injector import inject
from repository.interfaces.config import IDbConfig

from datetime import datetime
from datetime import timezone

from repository.interfaces.rsa_keys_broker import IRsaKeysBroker

class RsaKeysBroker(implements(IRsaKeysBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
       self.db = config.get_db()
    
    def get_rsa_key(self, username: str, isPublicKey: bool):
        usersCollection = self.db["users"]

        q = {"username": username, "is-rsa-key": True, "is-public-key": isPublicKey}

        return usersCollection.find_one(q)
    
    def set_rsa_key(self, username: str, isPrivateKey: bool, value: Any):
        c = self.db["users"]

        q = {
            "username": username, 
            "is-rsa-key": True, 
            "is-private-key": isPrivateKey,
            "is-public-key": not isPrivateKey
        }

        key = c.find_one(q)
        now = datetime.now(timezone.utc)
        if key is None: 
            msg = "There is no such key, so it will be added."
            s = {
                "username": username, 
                "is-rsa-key": True, 
                "is-private-key": isPrivateKey, 
                "is-public-key": not isPrivateKey,
                "value": value,
                "created-at": str(now)
            }
            c.insert_one(s)
        else:
            msg = "Key is found, so it will be updated to the new value."
            sq = {
                "username": username, 
                "is-rsa-key": True, 
                "is-private-key": isPrivateKey,
                "is-public-key": not isPrivateKey
                
            }
            uq = {"$set": {"value": value, "modified-at": str(now)}}
            c.update_one(sq, uq)

        print(msg)
        return msg
    
    def delete_by_username(self, username: str):
        c = self.db["users"]
        sq = {"username": username, "is-rsa-key": True}
        c.delete_many(sq)        