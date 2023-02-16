from interface import implements

from injector import inject
from seta_flask_server.repository.interfaces.config import IDbConfig

from datetime import datetime
import pytz

from seta_flask_server.repository.interfaces.rsa_keys_broker import IRsaKeysBroker

class RsaKeysBroker(implements(IRsaKeysBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
       self.db = config.get_db()
    
    def get_rsa_key(self, user_id: str):
        usersCollection = self.db["users"]

        q = {"user_id": user_id, "rsa_value": {"$exists" : True}}

        result = usersCollection.find_one(q)
        
        if result is None:
            return None
        
        return result["rsa_value"]
    
    def set_rsa_key(self, user_id: str, value: str):
        c = self.db["users"]

        q = {"user_id": user_id, "rsa_value": {"$exists" : True}}

        key = c.find_one(q)
        now = datetime.now(tz=pytz.utc)
        
        if key is None: 
            msg = "There is no such key, so it will be added."
            s = {
                "user_id": user_id, 
                "rsa_value": value,
                "created_at": now
            }
            c.insert_one(s)
        else:
            msg = "Key is found, so it will be updated to the new value."
            sq = {"user_id": user_id, "rsa_value": {"$exists" : True}}
            uq = {"$set": {"rsa_value": value, "modified_at": now}}
            c.update_one(sq, uq)

        return msg
    
    def delete_by_user_id(self, user_id: str):
        c = self.db["users"]
        q = {"user_id": user_id, "rsa_value": {"$exists" : True}}
        c.delete_many(q)