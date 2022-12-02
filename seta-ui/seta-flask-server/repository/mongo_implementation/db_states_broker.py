from datetime import datetime
import time
from typing import Any

from injector import inject
from repository.interfaces.config import IDbConfig

from interface import implements
from repository.interfaces.states_broker import IStatesBroker
    
class StatesBroker(implements(IStatesBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
       self.db = config.get_db()
    
    def get_state(self, username: str, key: str):
        usersCollection = self.db["users"]

        q = {"username": username, "key": key}

        return usersCollection.find_one(q)
    
    def get_corpus_queries(self, username: str):
        return self.get_state(username, "corpus-payload")
    
    def set_state(self, username: str, key: str, value: Any):
        c = self.db["users"]

        q = {"username": username, "key": key}

        state = c.find_one(q)
        is_new = False
        if state is None:
            is_new = True
            s = {"username": username, "key": key, "value": value, "created-at": str(datetime.now())}
            c.insert_one(s)
        else:
            sq = {"username": username, "key": key}
            sv = {"$set": {"value": value, "modified-at": str(time.time())}}
            c.update_one(sq, sv)

        return is_new
    
    def delete_state(self, username: str, key: str):
        c = self.db["users"]
        sq = {"username": username, "key": key}
        c.delete_one(sq)
        return "ok"