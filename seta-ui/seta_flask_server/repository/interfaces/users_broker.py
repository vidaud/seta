from interface import Interface
from seta_flask_server.repository.models import SetaUser

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
    
    def user_uid_exists(self, user_id: str) -> bool:
        pass