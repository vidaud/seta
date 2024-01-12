from flask import json
from flask.testing import FlaskClient
from tests.infrastructure.helpers.util import auth_headers

API_V1 = "/seta-ui/api/v1/me/auth-key"


def get_rsa_key(client: FlaskClient, access_token: str):
    """Public rsa for authenticated user."""

    return client.get(
        API_V1, content_type="application/json", headers=auth_headers(access_token)
    )


def create_rsa_key(client: FlaskClient, access_token: str, public_key: str):
    """Store public rsa for authenticated user."""

    payload = {"publicKey": public_key}

    return client.post(
        API_V1,
        data=json.dumps(payload),
        content_type="application/json",
        headers=auth_headers(access_token),
    )


def delete_rsa_key(client: FlaskClient, access_token: str):
    """Delete rsa for authenticated user."""

    return client.delete(
        API_V1,
        content_type="application/json",
        headers=auth_headers(access_token),
    )
