from interface import Interface
from typing import Any

class IUsersBroker(Interface):        
    def add_user(self, user: Any):
        pass
    
    def get_user_by_username(self, username: str):
        pass
    
    def update_user(self, username: str, field: str, value: Any):
        pass
    
    def delete_user(self, username: str):
        pass
    
    def move_documents(self, sourceCollection: str, targetCollection: str, filter: dict):
        pass
    
    def delete_old_user(self):
        pass