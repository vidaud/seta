import requests
from flask import current_app
from seta_flask_server.infrastructure import helpers


class PrivateClient:
    def __init__(self) -> None:
        self.private_api_root = current_app.config["PRIVATE_API_URL"]
        self.headers = {"Content-Type": "application/json"}


class PrivateResourceClient(PrivateClient):
    def __init__(self, resource_id: str) -> None:
        super().__init__()
        self.url = helpers.urljoin_segments(
            self.private_api_root, "resource", resource_id
        )

    def exists(self) -> bool:
        """Check if resource identifier exists in ES"""
        result = requests.get(url=self.url, headers=self.headers, timeout=30)
        result.raise_for_status()

        data = result.json()
        if "exists" in data:
            return data["exists"]

        # ? should this be True?
        return False

    def delete(self) -> None:
        """Delete resource from ES"""
        result = requests.delete(url=self.url, headers=self.headers, timeout=30)
        result.raise_for_status()


class PrivateResourcesClient(PrivateClient):
    def all(self) -> list[str]:
        """All resource identifiers from ES"""
        result = requests.get(
            url=helpers.urljoin_segments(self.private_api_root, "resource", "all"),
            headers=self.headers,
            timeout=30,
        )
        result.raise_for_status()

        data = result.json()
        if "resources" in data:
            return data["resources"]

        return None
