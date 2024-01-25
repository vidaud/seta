from flask import json
from flask.testing import FlaskClient
from tests.infrastructure.helpers.util import auth_headers

API_V1 = "/seta-ui/api/v1/me/unsearchables"


def get_unsearchable_resources(client: FlaskClient, access_token: str):
    """Get unsearchable resources."""

    return client.get(
        API_V1, content_type="application/json", headers=auth_headers(access_token)
    )


def manage_unsearchable_resources(
    client: FlaskClient, access_token: str, resource_ids: list[str]
):
    """Set unsearchable resources."""

    data = {"dataSourceIds": resource_ids}

    return client.post(
        API_V1,
        data=json.dumps(data),
        content_type="application/json",
        headers=auth_headers(access_token),
    )
