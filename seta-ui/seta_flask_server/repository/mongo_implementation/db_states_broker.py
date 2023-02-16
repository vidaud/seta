from datetime import datetime
import pytz
from typing import Any

from injector import inject
from seta_flask_server.repository.interfaces.config import IDbConfig

from interface import implements
from seta_flask_server.repository.interfaces.states_broker import IStatesBroker
    
class StatesBroker(implements(IStatesBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
       self.db = config.get_db()
    
    def get_state(self, user_id: str, key: str):
        usersCollection = self.db["users"]

        q = {"user_id": user_id, "query_key": key}

        result = usersCollection.find_one(q)
        
        if result is None:
            return None
        
        return result
    
    def get_corpus_queries(self, user_id: str):
        return self.get_state(user_id, "corpus-payload")
    
    def set_state(self, user_id: str, key: str, value: Any):
        c = self.db["users"]

        q = {"user_id": user_id, "query_key": key}

        state = c.find_one(q)
        is_new = False
        now = datetime.now(pytz.utc)
        
        if state is None:
            is_new = True
            s = {"user_id": user_id, "query_key": key, "query_value": value, "created_at": now}
            c.insert_one(s)
        else:
            sq = {"user_id": user_id, "query_key": key}
            sv = {"$set": {"query_value": value, "modified_at": now}}
            c.update_one(sq, sv)

        return is_new
    
    def delete_state(self, user_id: str, key: str):
        c = self.db["users"]
        sq = {"user_id": user_id, "query_key": key}
        c.delete_one(sq)