from interface import Interface
from seta_flask_server.repository.models import SetaUser

class IUsersBroker(Interface):
    
    #---------------- Get methods ----------------#
    
    def authenticate_user(self, auth_user: SetaUser) -> SetaUser:
        pass
    
    def get_user_by_id_and_provider(self, user_id: str, provider_uid: str, provider: str, load_scopes: bool = False) -> SetaUser:
        pass
    
    def get_user_by_id(self, user_id: str, load_scopes: bool = True) -> SetaUser:
        pass
    
    def get_user_by_email(self, email: str) -> SetaUser:
        pass

    def get_all(self, load_scopes: bool = True) -> list[SetaUser]:
        """
        Return the list of all user accounts and their providers

        :param load_scopes:
            Load permission scopes for each user
        """
        pass

    def get_all_by_status(self, status: str) -> list[SetaUser]:
        """
        Return the list of all user accounts and their providers by user status ('active', 'blocked', 'deleted')

        :param status:
            Filter by status
        """
        pass
    
    def user_uid_exists(self, user_id: str) -> bool:
        pass
    
    def delete(self, user_id: str):
        pass