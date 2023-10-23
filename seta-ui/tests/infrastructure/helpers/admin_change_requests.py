from flask.testing import FlaskClient
from .util import auth_headers

API_ADMIN = "/seta-ui/api/v1/admin"


def get_community_pending_change_requests(client: FlaskClient, access_token: str):
    url = f"{API_ADMIN}/communities/change-requests"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


def update_community_change_request(
    client: FlaskClient,
    access_token: str,
    community_id: str,
    request_id: str,
    status: str,
):
    url = f"{API_ADMIN}/communities/{community_id}/change-requests/{request_id}"

    data = f"status={status}"
    return client.put(
        url,
        data=data,
        content_type="application/x-www-form-urlencoded",
        headers=auth_headers(access_token),
    )


def get_resource_pending_change_requests(client: FlaskClient, access_token: str):
    url = f"{API_ADMIN}/resources/change-requests"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


def update_resource_change_request(
    client: FlaskClient,
    access_token: str,
    resource_id: str,
    request_id: str,
    status: str,
):
    url = f"{API_ADMIN}/resources/{resource_id}/change-requests/{request_id}"

    data = f"status={status}"
    return client.put(
        url,
        data=data,
        content_type="application/x-www-form-urlencoded",
        headers=auth_headers(access_token),
    )
