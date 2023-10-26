from flask.testing import FlaskClient
from seta_flask_server.infrastructure.constants import ResourceTypeConstants
from .util import auth_headers

API_V1 = "/seta-ui/api/v1"


def get_resource(client: FlaskClient, access_token: str, resource_id: str):
    """Request resource by id."""

    url = f"{API_V1}/resources/{resource_id}"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


def get_accessible_resources(client: FlaskClient, access_token: str):
    """Retrieve list of queryable resources."""

    url = f"{API_V1}/resources/"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


def create_resource(
    client: FlaskClient,
    access_token: str,
    community_id: str,
    resource_id: str,
    title: str,
    abstract: str,
    resource_type: str = ResourceTypeConstants.Discoverable,
):
    """Create a resource."""

    url = f"{API_V1}/communities/{community_id}/resources"

    data = f"resource_id={resource_id}&title={title}&abstract={abstract}&type={resource_type}"
    return client.post(
        url,
        data=data,
        content_type="application/x-www-form-urlencoded",
        headers=auth_headers(access_token),
    )


def update_resource(
    client: FlaskClient,
    access_token: str,
    resource_id: str,
    title: str,
    abstract: str,
    status: str,
):
    """Update a resource."""

    url = f"{API_V1}/resources/{resource_id}"

    data = f"title={title}&abstract={abstract}&status={status}"
    return client.put(
        url,
        data=data,
        content_type="application/x-www-form-urlencoded",
        headers=auth_headers(access_token),
    )


def delete_resource(client: FlaskClient, access_token: str, resource_id: str):
    """Delete a resource."""

    url = f"{API_V1}/resources/{resource_id}"

    return client.delete(url, headers=auth_headers(access_token))
