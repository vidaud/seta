from flask.testing import FlaskClient
from tests.infrastructure.helpers.util import auth_headers

API_V1 = "/seta-ui/api/v1/me/permissions"


def get_permissions(client: FlaskClient, access_token: str):
    """All user permissions."""

    return client.get(
        API_V1, content_type="application/json", headers=auth_headers(access_token)
    )
