from interface import Interface
from typing import Any

class IRsaKeysBroker(Interface):
    def get_rsa_key(self, user_id: str):
        pass
    
    def set_rsa_key(self, user_id: str, value: str):
        pass
    
    def delete_by_user_id(self, user_id: str):
        pass    