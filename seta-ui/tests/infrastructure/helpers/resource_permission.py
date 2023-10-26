from flask.testing import FlaskClient
from .util import auth_headers

API_V1 = "/seta-ui/api/v1"


def get_user_permissions_for_resource(
    client: FlaskClient, access_token: str, resource_id: str, user_id: str
):
    """Permissions for resource."""

    url = f"{API_V1}/permissions/resource/{resource_id}/user/{user_id}"

    return client.get(url, headers=auth_headers(access_token))


def replace_user_permissions_for_resource(
    client: FlaskClient,
    access_token: str,
    resource_id: str,
    user_id: str,
    scopes: list[str],
):
    """Update user permissions for a resource."""

    url = f"{API_V1}/permissions/resource/{resource_id}/user/{user_id}"

    data = ""
    for scope in scopes:
        if data == "":
            data += f"scope={scope}"
        else:
            data += f"&scope={scope}"

    return client.post(
        url,
        data=data,
        content_type="application/x-www-form-urlencoded",
        headers=auth_headers(access_token),
    )
