from flask.testing import FlaskClient
from flask import json

from tests.infrastructure.helpers.util import auth_headers
from seta_flask_server.repository.models import RollingIndex

API_V1 = "/seta-ui/api/v1/admin/rolling-indexes"


def get_all_rolling_indexes(client: FlaskClient, access_token: str):
    """Client for GET all rolling indexes."""

    url = API_V1

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


def create_rolling_index(
    client: FlaskClient, access_token: str, rolling_index: RollingIndex
):
    """Client for creating rolling index."""

    url = API_V1

    payload = {
        "name": rolling_index.rolling_index_name.lower(),
        "title": rolling_index.title,
        "description": rolling_index.description,
        "limits": rolling_index.limits.to_json(),
        "communities": rolling_index.community_ids,
    }

    data = json.dumps(payload)
    return client.post(
        url,
        data=data,
        content_type="application/json",
        headers=auth_headers(access_token),
    )


def update_rolling_index(
    client: FlaskClient, access_token: str, rolling_index: RollingIndex
):
    """Client for creating rolling index."""

    url = f"{API_V1}/{rolling_index.rolling_index_name}"

    payload = {
        "title": rolling_index.title,
        "description": rolling_index.description,
        "limits": rolling_index.limits.to_json(),
        "is_disabled": rolling_index.is_disabled,
    }

    data = json.dumps(payload)
    return client.put(
        url,
        data=data,
        content_type="application/json",
        headers=auth_headers(access_token),
    )


def create_active_index(
    client: FlaskClient, access_token: str, rolling_index_name: str
):
    """Client for new active index."""

    url = f"{API_V1}/{rolling_index_name}/active-index"

    return client.post(
        url,
        data=None,
        content_type="application/json",
        headers=auth_headers(access_token),
    )


def replace_communities(
    client: FlaskClient,
    access_token: str,
    rolling_index_name: str,
    communities: list[str],
):
    """Client for replace communities endpoint."""

    url = f"{API_V1}/{rolling_index_name}/communities"

    data = json.dumps({"communities": communities})

    return client.post(
        url,
        data=data,
        content_type="application/json",
        headers=auth_headers(access_token),
    )
