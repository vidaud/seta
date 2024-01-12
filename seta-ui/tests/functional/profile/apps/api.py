from flask import json
from flask.testing import FlaskClient
from tests.infrastructure.helpers.util import auth_headers

API_V1 = "/seta-ui/api/v1/me/apps"


def create_app(
    client: FlaskClient,
    access_token: str,
    name: str,
    description: str,
    copy_public_key: bool = False,
):
    """Create an application for user."""
    payload = {
        "name": name,
        "description": description,
        "copyPublicKey": copy_public_key,
    }

    data = json.dumps(payload)

    return client.post(
        API_V1,
        data=data,
        content_type="application/json",
        headers=auth_headers(access_token),
    )


def get_user_apps(client: FlaskClient, access_token: str):
    """Get user applications."""

    return client.get(
        API_V1, content_type="application/json", headers=auth_headers(access_token)
    )


def update_app(
    client: FlaskClient, access_token: str, name: str, new_name: str, description: str
):
    """Update application."""

    payload = {
        "new_name": new_name,
        "description": description,
        "status": "active",
    }

    data = json.dumps(payload)

    return client.put(
        f"{API_V1}/{name}",
        data=data,
        content_type="application/json",
        headers=auth_headers(access_token),
    )


def get_app_rsa(client: FlaskClient, access_token: str, name: str):
    """Gets application rsa public key."""

    return client.get(
        f"{API_V1}/{name}/auth-key",
        content_type="application/json",
        headers=auth_headers(access_token),
    )
