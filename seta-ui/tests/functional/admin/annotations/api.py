from flask import json
from flask.testing import FlaskClient

from tests.infrastructure.helpers.util import auth_headers

API_V1 = "/seta-ui/api/v1/admin/annotations"


def get_all_annotations(client: FlaskClient, access_token: str):
    """Client for GET all annotations."""

    url = API_V1

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


def create_annotation(client: FlaskClient, access_token: str, payload: dict):
    """Client for creating annotation."""

    url = API_V1

    data = json.dumps(payload)
    return client.post(
        url,
        data=data,
        content_type="application/json",
        headers=auth_headers(access_token),
    )


def update_annotation(
    client: FlaskClient, access_token: str, label: str, payload: dict
):
    """Client for updating annotation."""

    url = API_V1 + "/" + label

    data = json.dumps(payload)
    return client.put(
        url,
        data=data,
        content_type="application/json",
        headers=auth_headers(access_token),
    )


def delete_annotation(client: FlaskClient, access_token: str, label: str):
    """Client for deleting annotation."""

    url = API_V1 + "/" + label

    return client.delete(
        url, content_type="application/json", headers=auth_headers(access_token)
    )
