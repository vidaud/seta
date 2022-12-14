from typing import Any

from interface import Interface

class IStatesBroker(Interface):
    def get_state(self, user_id: str, key: str):
        pass
    
    def get_corpus_queries(self, user_id: str):
        pass
    
    def set_state(self, user_id: str, key: str, value: Any):
        pass
    
    def delete_state(self, user_id: str, key: str):
        pass