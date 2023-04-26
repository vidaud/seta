from interface import Interface
from seta_flask_server.repository.models import SetaApplication

class IAppsBroker(Interface):
    
    def get_all_by_parent_id(self, parent_id: str) -> list[SetaApplication]:
        """
        Get all applications that belong to user
        
        :param parent_id:
            The parent user id
        """
        
        pass
    
    def get_by_parent_id_and_name(self, parent_id: str, name: str) -> SetaApplication:
        """
        Retrives an application
        
        :param parent_id:
            The parent user id            
        :param name:
            The app name
        """
        
        pass
    
    def app_exists(self, parent_id: str, name: str) -> bool:
        """
        Check if an application exists for the parent user
        
        :param parent_id:
            The parent user id            
        :param name:
            The app name
        """
        
        pass
    
    def get_by_user_id(self, user_id: str) -> SetaApplication:
        """
        Retrives an application by its user identifier
        
        :param user_id:
            The user identifier
        """
        
        pass
    
    def create(self, app: SetaApplication, copy_parent_scopes: True, copy_parent_rsa: bool = False):
        """
        Creates an application
        
        :param app:
            The application object
        :param copy_parent_scopes:
            Indicates that the new app gets the same resource scopes as its parent
        :param copy_parent_rsa:
            Indicates that the new application has the same public key as its parent
        """
        
        pass
    
    def update(self, old: SetaApplication, new: SetaApplication):
        """
        Updates an application (both name and description can be updated)
        
        :param old:
            The old version of application (both name and description)
        :param new:
            The new version of application            
        """
        
        pass
    
    