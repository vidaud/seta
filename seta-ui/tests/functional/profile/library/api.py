from flask import json
from flask.testing import FlaskClient
from tests.infrastructure.helpers.util import auth_headers

API_V1 = "/seta-ui/api/v1/me/library"


def create_library_items(client: FlaskClient, access_token: str, payload: list[dict]):
    """Create library items."""

    return client.post(
        API_V1,
        data=json.dumps(payload),
        content_type="application/json",
        headers=auth_headers(access_token),
    )


def get_library_tree(client: FlaskClient, access_token: str):
    """Get library tree."""

    return client.get(
        API_V1,
        content_type="application/json",
        headers=auth_headers(access_token),
    )


def update_library_item(
    client: FlaskClient, access_token: str, item_id: str, payload: dict
):
    """Update library item."""

    return client.put(
        f"{API_V1}/{item_id}",
        data=json.dumps(payload),
        content_type="application/json",
        headers=auth_headers(access_token),
    )


def delete_library_item(client: FlaskClient, access_token: str, item_id: str):
    """Delete library item."""

    return client.delete(
        f"{API_V1}/{item_id}",
        content_type="application/json",
        headers=auth_headers(access_token),
    )
