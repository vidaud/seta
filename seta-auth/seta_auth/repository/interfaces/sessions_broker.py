from interface import Interface

class ISessionsBroker(Interface):    
    def session_token_is_blocked(self, token_jti: str) -> bool:
        pass
     