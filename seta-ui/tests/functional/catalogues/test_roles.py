from http import HTTPStatus
import pytest
from flask.testing import FlaskClient

from tests.infrastructure.helpers.authentication import login_user
from tests.functional.catalogues import api

from tests.infrastructure.helpers.util import get_access_token


@pytest.mark.parametrize("user_id", [("seta_admin")])
def test_get_all_roles(
    client: FlaskClient, authentication_url: str, user_key_pairs: dict, user_id: str
):
    """Test get all roles."""

    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    response = api.get_all_roles(client=client, access_token=access_token)
    assert response.status_code == HTTPStatus.OK

    assert "application" in response.json
    assert response.json["application"]


@pytest.mark.parametrize("user_id, category", [("seta_admin", "application")])
def test_get_roles_by_category(
    client: FlaskClient,
    authentication_url: str,
    user_key_pairs: dict,
    user_id: str,
    category,
):
    """Test get roles by category."""

    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    response = api.get_roles_by_category(
        client=client, access_token=access_token, category=category
    )
    assert response.status_code == HTTPStatus.OK
