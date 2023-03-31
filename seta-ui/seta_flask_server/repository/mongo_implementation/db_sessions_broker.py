from interface import implements
from injector import inject
import pytz

from datetime import datetime
from seta_flask_server.repository.interfaces import IDbConfig, ISessionsBroker
from seta_flask_server.repository.models import UserSession, SessionToken

class SessionsBroker(implements(ISessionsBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.config = config
        self.db = config.get_db()
        self.collection = self.db["sessions"]
        
    #---------------- User session ----------------#
     
    def session_create(self, user_session: UserSession) -> None:        
        with self.db.client.start_session(causal_consistency=True) as session:
           self.collection.insert_one(user_session.to_json(), session=session)
           
           tokens = [st.to_json() for st in user_session.session_tokens]
           self.collection.insert_many(tokens, session=session)
           
            
    
    def session_logout(self, session_id: str) -> None:        
        now = datetime.now(tz=pytz.utc)
        
        with self.db.client.start_session(causal_consistency=True) as session:
            uq={"$set": {"end_at": now} }
            self.collection.update_one({"session_id": session_id, "user_id": {"$exists" : True}}, uq, session=session)
            
            uq={"$set": {"is_blocked": True, "blocked_at": now} }
            self.collection.update_many({"session_id": session_id, "token_jti": {"$exists" : True}}, uq, session=session)
        
    def session_add_token(self, token: SessionToken) -> None:        
        self.collection.insert_one(token.to_json())
    
    def session_token_set_blocked(self, token_jti: str) -> None:        
        filter = { "token_jti": token_jti }
        uq={"$set": {"is_blocked": True, "blocked_at": datetime.now(tz=pytz.utc)} }
        self.collection.update_one(filter, uq)
        
    def session_token_is_blocked(self, token_jti: str) -> bool:
        filter = { "token_jti": token_jti, "is_blocked": True }
        
        return self.collection.count_documents(filter) > 0
     
    #-------------------------------------------------------#