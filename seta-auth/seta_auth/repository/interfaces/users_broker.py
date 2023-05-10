from interface import Interface
from seta_auth.repository.models import SetaUser

class IUsersBroker(Interface):
        
    def get_user_by_id(self, user_id: str) -> SetaUser:
        pass
    
    def get_user_by_provider(self, provider_uid: str, provider: str) -> SetaUser:
        pass