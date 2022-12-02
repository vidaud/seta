from interface import Interface
from typing import Any

class IRsaKeysBroker(Interface):
    def get_rsa_key(self, username: str, isPublicKey: bool):
        pass
    
    def set_rsa_key(self, username: str, isPrivateKey: bool, value: Any):
        pass
    
    def delete_by_username(self, username: str):
        pass
    
    