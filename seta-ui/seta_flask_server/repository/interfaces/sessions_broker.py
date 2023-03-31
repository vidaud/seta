from interface import Interface
from seta_flask_server.repository.models import UserSession, SessionToken

class ISessionsBroker(Interface):
     
    def session_create(self, user_session: UserSession) -> None:
        pass
    
    def session_logout(self, session_id: str) -> None:
        pass
    
    def session_add_token(self, token: SessionToken) -> None:
        pass
    
    def session_token_set_blocked(self, token_jti: str) -> None:
        pass
    
    def session_token_is_blocked(self, token_jti: str) -> bool:
        pass
     