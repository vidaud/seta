from flask import json
from flask.testing import FlaskClient
from .util import auth_headers

API_V1 = "/seta-ui/api/v1/me"

# =========== user info  =================#


def get_account_info(client: FlaskClient, access_token: str):
    """Account complete info."""

    url = f"{API_V1}/"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


def get_user_info(client: FlaskClient, access_token: str):
    """User info - fewer details."""

    url = f"{API_V1}/user-info"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


# ========= RSA Keys ======================#


def get_rsa_key(client: FlaskClient, access_token: str):
    """Public rsa for authenticated user."""

    url = f"{API_V1}/rsa-key"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


def create_rsa_key(client: FlaskClient, access_token: str):
    """Create rsa for authenticated user."""

    url = f"{API_V1}/rsa-key"

    return client.post(
        url,
        content_type="application/x-www-form-urlencoded",
        headers=auth_headers(access_token),
    )


def delete_rsa_key(client: FlaskClient, access_token: str):
    """Delete rsa for authenticated user."""

    url = f"{API_V1}/rsa-key"

    return client.delete(
        url,
        content_type="application/x-www-form-urlencoded",
        headers=auth_headers(access_token),
    )


# ========== Applications =================#


def create_app(
    client: FlaskClient,
    access_token: str,
    name: str,
    description: str,
    copy_public_key: bool = False,
    copy_resource_scopes: bool = True,
):
    """Create an application for user."""

    url = f"{API_V1}/apps"

    payload = {
        "name": name,
        "description": description,
        "copyPublicKey": copy_public_key,
        "copyResourceScopes": copy_resource_scopes,
    }

    data = json.dumps(payload)

    return client.post(
        url,
        data=data,
        content_type="application/json",
        headers=auth_headers(access_token),
    )


def get_user_apps(client: FlaskClient, access_token: str):
    """Get user applications."""

    url = f"{API_V1}/apps"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


def get_app(client: FlaskClient, access_token: str, name: str):
    """Find application by name."""

    url = f"{API_V1}/apps/{name}"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


def update_app(
    client: FlaskClient, access_token: str, name: str, new_name: str, description: str
):
    """Update application."""

    url = f"{API_V1}/apps/{name}"

    payload = {
        "new_name": new_name,
        "description": description,
    }

    data = json.dumps(payload)

    return client.put(
        url,
        data=data,
        content_type="application/json",
        headers=auth_headers(access_token),
    )


# =========== Permissions  =================#


def get_permissions(client: FlaskClient, access_token: str):
    """All user permissions."""

    url = f"{API_V1}/permissions"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


# =========== Unsearchables  =================#


def get_unsearchable_resources(client: FlaskClient, access_token: str):
    """Get unsearchable resources."""

    url = f"{API_V1}/resources"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


def manage_unsearchable_resources(
    client: FlaskClient, access_token: str, resource_ids: list[str]
):
    """Set unsearchable resources."""

    url = f"{API_V1}/resources"

    data = ""
    for rid in resource_ids:
        if data == "":
            data += f"resource={rid}"
        else:
            data += f"&resource={rid}"

    return client.post(
        url,
        data=data,
        content_type="application/x-www-form-urlencoded",
        headers=auth_headers(access_token),
    )
