from flask.testing import FlaskClient
from .util import auth_headers

API_V1 = "/seta-ui/api/v1"


def create_community_invite(
    client: FlaskClient,
    access_token: str,
    community_id: str,
    emails: list[str],
    message: str,
):
    url = f"{API_V1}/communities/{community_id}/invites"

    data = f"message={message}"

    for email in emails:
        data += f"&email={email}"

    return client.post(
        url,
        data=data,
        content_type="application/x-www-form-urlencoded",
        headers=auth_headers(access_token),
    )


def get_community_pending_invites(
    client: FlaskClient, access_token: str, community_id: str
):
    url = f"{API_V1}/communities/{community_id}/invites"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


def get_pending_invites(client: FlaskClient, access_token: str, community_id: str):
    url = f"{API_V1}/invites"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


def get_invite(client: FlaskClient, access_token: str, invite_id: str):
    url = f"{API_V1}/invites/{invite_id}"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


def update_invite(client: FlaskClient, access_token: str, invite_id: str, status: str):
    url = f"{API_V1}/invites/{invite_id}"

    data = f"status={status}"
    return client.put(
        url,
        data=data,
        content_type="application/x-www-form-urlencoded",
        headers=auth_headers(access_token),
    )
