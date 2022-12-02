from typing import Any

from interface import Interface

class IStatesBroker(Interface):
    def get_state(self, username: str, key: str):
        pass
    
    def get_corpus_queries(self, username: str):
        pass
    
    def set_state(self, username: str, key: str, value: Any):
        pass
    
    def delete_state(self, username: str, key: str):
        pass