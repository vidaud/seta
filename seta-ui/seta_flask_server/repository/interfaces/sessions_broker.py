from datetime import datetime
from interface import Interface
from seta_flask_server.repository.models import UserSession, SessionToken, RefreshedPair

class ISessionsBroker(Interface):
     
    def session_create(self, user_session: UserSession) -> None:
        """
        Create a new user session and insert the access & refresh tokens
        """

        pass

    def session_refresh(self, user_session: UserSession, refreshed_pair: RefreshedPair) -> None:
        """
        Block all active tokens and insert the new access & refresh tokens
        """

        pass
    
    def session_logout(self, session_id: str) -> None:
        """
        Block all active tokens and set session as ended
        """

        pass
    
    def session_token_is_blocked(self, token_jti: str) -> bool:
        """
        Check if a token is blocked
        """

        pass

    def session_token_set_blocked(self, token_jti: str) -> None:
        """
        Set a token as blocked
        """
         
        pass

    def get_session_token(self, session_id: str, token_jti: str, token_type: str = None) -> SessionToken:
        """
        Return a session token

        :param session_id:
            Current session id

        :param token_jti:
            Token unique id

        :param token_type:
         Optional, one of 'access' or 'refresh'
        """
         
        pass

    def unblock_session_tokens(self, date: datetime):
        """
        Unblock old tokens with block date before 'date'

        :param date:
            Block date upper limit
        """

        pass