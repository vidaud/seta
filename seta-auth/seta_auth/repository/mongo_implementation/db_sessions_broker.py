from interface import implements
from injector import inject
from seta_auth.repository.interfaces import IDbConfig, ISessionsBroker

class SessionsBroker(implements(ISessionsBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.config = config
        self.db = config.get_db()
        self.collection = self.db["sessions"]
 
        
    def session_token_is_blocked(self, token_jti: str) -> bool:
        filter = { "token_jti": token_jti, "is_blocked": True }
        
        return self.collection.count_documents(filter) > 0