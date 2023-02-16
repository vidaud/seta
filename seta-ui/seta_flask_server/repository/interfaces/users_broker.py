from interface import Interface
from typing import Any
from seta_flask_server.repository.models.seta_user import SetaUser

class IUsersBroker(Interface):
    
    #---------------- New methods ----------------#
    
    def authenticate_user(self, auth_user: SetaUser) -> SetaUser:
        pass
    
    def get_user_by_id_and_provider(self, user_id: str, provider_uid: str, provider: str) -> SetaUser:
        pass
    
    def get_user_by_id(self, user_id: str) -> SetaUser:
        pass
    
    def get_user_by_email(self, email: str) -> SetaUser:
        pass
    
    #-------------------------------------------------------#
    
    '''
    def add_user(self, user: Any):
        pass
    '''
     
    '''
    def get_user_by_username(self, username: str):
        pass
    '''   
    
    '''
    def update_user(self, username: str, field: str, value: Any):
        pass
    '''
    
    def move_documents(self, sourceCollection: str, targetCollection: str, filter: dict):
        pass
    
    def delete_old_user(self):
        pass