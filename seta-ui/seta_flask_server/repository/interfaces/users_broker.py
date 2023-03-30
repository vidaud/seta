from interface import Interface
from seta_flask_server.repository.models import SetaUser, UserSession, SessionToken

class IUsersBroker(Interface):
    
    #---------------- Get methods ----------------#
    
    def authenticate_user(self, auth_user: SetaUser) -> SetaUser:
        pass
    
    def get_user_by_id_and_provider(self, user_id: str, provider_uid: str, provider: str) -> SetaUser:
        pass
    
    def get_user_by_id(self, user_id: str) -> SetaUser:
        pass
    
    def get_user_by_email(self, email: str) -> SetaUser:
        pass
    
    #-------------------------------------------------------#
    
    
    #---------------- User session ----------------#
     
    def session_create(self, user_session: UserSession) -> None:
        pass
    
    def session_logout(self, session_id: str) -> None:
        pass
    
    def session_add_token(self, token: SessionToken) -> None:
        pass
    
    def session_token_set_blocked(self, session_id: str, token_jti: str) -> bool:
        pass
     
    #-------------------------------------------------------#

    
    def move_documents(self, sourceCollection: str, targetCollection: str, filter: dict):
        pass
    
    def delete_old_user(self):
        pass