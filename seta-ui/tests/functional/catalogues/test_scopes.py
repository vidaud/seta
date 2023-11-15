from http import HTTPStatus
import pytest
from flask.testing import FlaskClient

from tests.infrastructure.helpers.authentication import login_user
from tests.infrastructure.helpers.catalogues import (
    get_all_scopes,
    get_scopes_by_category,
)

from tests.infrastructure.helpers.util import get_access_token


@pytest.mark.parametrize("user_id", [("seta_admin")])
def test_get_all_scopes(
    client: FlaskClient, authentication_url: str, user_key_pairs: dict, user_id: str
):
    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    response = get_all_scopes(client=client, access_token=access_token)
    assert response.status_code == HTTPStatus.OK

    assert "system" in response.json
    assert response.json["system"]

    assert "community" in response.json
    assert response.json["community"]

    assert "resource" in response.json
    assert response.json["resource"]


@pytest.mark.parametrize(
    "user_id, category",
    [("seta_admin", "system"), ("seta_admin", "community"), ("seta_admin", "resource")],
)
def test_get_scopes_by_category(
    client: FlaskClient,
    authentication_url: str,
    user_key_pairs: dict,
    user_id: str,
    category,
):
    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)
    response = get_scopes_by_category(
        client=client, access_token=access_token, category=category
    )
    assert response.status_code == HTTPStatus.OK
    assert response.json
