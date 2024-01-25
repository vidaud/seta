from flask.testing import FlaskClient
from tests.infrastructure.helpers.util import auth_headers

API_V1 = "/seta-ui/api/v1/me"


def get_account_info(client: FlaskClient, access_token: str):
    """Account complete info."""

    return client.get(
        f"{API_V1}/",
        content_type="application/json",
        headers=auth_headers(access_token),
    )


def get_user_info(client: FlaskClient, access_token: str):
    """User info - fewer details."""

    url = f"{API_V1}/user-info"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )
