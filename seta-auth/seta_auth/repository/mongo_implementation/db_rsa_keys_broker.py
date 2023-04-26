from interface import implements

from injector import inject
from seta_auth.repository.interfaces import IDbConfig, IRsaKeysBroker

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