import requests
from flask import current_app
from seta_flask_server.infrastructure.helpers import urljoin_segments

class PrivateClient:
    def __init__(self) -> None:
        self.private_api_root = current_app.config["PRIVATE_API_URL"]
        self.headers = {"Content-Type": "application/json"}    

class PrivateResourceClient(PrivateClient): 
    
    def __init__(self, resource_id: str) -> None:
        super().__init__()
        self.url = urljoin_segments(self.private_api_root, "resource", resource_id)
    
    def exists(self) -> bool:        
        result = requests.get(url=self.url, headers=self.headers)
        result.raise_for_status()
        
        data = result.json()
        if "exists" in data:
            return data["exists"]
        
        #? should this be True?
        return False        
    
    def delete(self) -> None:
        result = requests.delete(url=self.url, headers=self.headers)
        result.raise_for_status()

class PrivateResourcesClient(PrivateClient):

    def all(self) -> list[str]:
        result = requests.get(url=urljoin_segments(self.private_api_root, "resource", "all"), headers=self.headers)
        result.raise_for_status()
        
        data = result.json()
        if "resources" in data:
            return data["resources"]
        
        return None