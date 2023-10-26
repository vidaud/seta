from flask.testing import FlaskClient
from .util import auth_headers

API_V1 = "/seta-ui/api/v1"


def get_community(client: FlaskClient, access_token: str, community_id: str):
    url = f"{API_V1}/communities/{community_id}"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


def create_community(
    client: FlaskClient,
    access_token: str,
    community_id: str,
    title: str,
    description: str,
):
    url = f"{API_V1}/communities/"

    data = f"community_id={community_id}&title={title}&description={description}"
    return client.post(
        url,
        data=data,
        content_type="application/x-www-form-urlencoded",
        headers=auth_headers(access_token),
    )


def update_community(
    client: FlaskClient,
    access_token: str,
    community_id: str,
    title: str,
    description: str,
    status: str,
):
    url = f"{API_V1}/communities/{community_id}"

    data = f"title={title}&description={description}&status={status}"
    return client.put(
        url,
        data=data,
        content_type="application/x-www-form-urlencoded",
        headers=auth_headers(access_token),
    )


def delete_community(client: FlaskClient, access_token: str, community_id: str):
    url = f"{API_V1}/communities/{community_id}"

    return client.delete(url, headers=auth_headers(access_token))
