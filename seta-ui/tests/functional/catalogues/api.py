# pylint: disable=missing-function-docstring
from flask.testing import FlaskClient
from tests.infrastructure.helpers.util import auth_headers

API_V1 = "/seta-ui/api/v1/catalogue"

# =========== scopes ================#


def get_all_scopes(client: FlaskClient, access_token: str):
    url = f"{API_V1}/scopes"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


def get_scopes_by_category(client: FlaskClient, access_token: str, category: str):
    url = f"{API_V1}/scopes/{category}"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


# =========== roles ================#


def get_all_roles(client: FlaskClient, access_token: str):
    url = f"{API_V1}/roles"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


def get_roles_by_category(client: FlaskClient, access_token: str, category: str):
    url = f"{API_V1}/roles/{category}"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


# =========== annotations ================#


def get_all_annotations(client: FlaskClient, access_token: str):
    url = f"{API_V1}/annotations"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


# =========== fields ================#


def get_all_fields(client: FlaskClient, access_token: str):
    url = f"{API_V1}/fields"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


# =========== data-sources ================#


def get_all_data_sources(client: FlaskClient, access_token: str):
    url = "/seta-ui/api/v1/data-sources"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )
