import requests
from flask import current_app
from seta_flask_server.infrastructure.helpers import urljoin_segments

class PrivateResourceClient: 
    
    def __init__(self, resource_id: str) -> None:
        private_api_root = current_app.config["PRIVATE_API_URL"]
        
        self.url = urljoin_segments(private_api_root, "resource", resource_id)
        self.headers = {"Content-Type": "application/json"}
    
    def exists(self) -> bool:        
        result = requests.get(url=self.url, headers=self.headers)
        result.raise_for_status()
        
        data = result.json()
        if "exists" in data:
            return data["exists"]
        
        #! should this be True?
        return False        
    
    def delete(self) -> None:
        result = requests.delete(url=self.url, headers=self.headers)
        result.raise_for_status()
    