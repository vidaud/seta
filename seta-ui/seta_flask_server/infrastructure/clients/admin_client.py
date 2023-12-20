import json
import requests

from flask import current_app
from seta_flask_server.infrastructure import helpers


class AdminClient:
    def __init__(self) -> None:
        self.api_root = current_app.config["INTERNAL_ADMIN_API"]
        self.headers = {"Content-Type": "application/json"}


class AdminIndexesClient(AdminClient):
    def __init__(self) -> None:
        super().__init__()

        self.url = helpers.urljoin_segments(self.api_root, "indexes")

    def create(self, index_name: str):
        """Creates a new index in Search engine."""

        payload = {"name": index_name}
        data = json.dumps(payload)

        result = requests.post(
            url=self.url, data=data, headers=self.headers, timeout=30
        )
        result.raise_for_status()

    def delete(self, index_name: str) -> None:
        """Delete search index"""

        payload = {"name": index_name}
        data = json.dumps(payload)

        result = requests.delete(
            url=self.url, data=data, headers=self.headers, timeout=30
        )
        result.raise_for_status()
