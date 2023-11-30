from flask.testing import FlaskClient
from flask import json

from tests.infrastructure.helpers.util import auth_headers

API_V1 = "/seta-ui/api/v1/admin/data-sources"


def get_data_sources(client: FlaskClient, access_token: str):
    """Client for GET all data sources."""

    url = API_V1

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


def create_data_source(client: FlaskClient, access_token: str, payload: dict):
    """Client for creating data source."""

    url = API_V1

    data = json.dumps(payload)
    return client.post(
        url,
        data=data,
        content_type="application/json",
        headers=auth_headers(access_token),
    )


def update_data_source(
    client: FlaskClient, access_token: str, data_source_id: str, payload: dict
):
    """Client for updating data source."""

    url = f"{API_V1}/{data_source_id}"

    data = json.dumps(payload)
    return client.put(
        url,
        data=data,
        content_type="application/json",
        headers=auth_headers(access_token),
    )
