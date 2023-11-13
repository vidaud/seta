from http import HTTPStatus
import pytest
from flask.testing import FlaskClient

from tests.infrastructure.helpers.authentication import login_user
from tests.infrastructure.helpers.profile import get_account_info, get_user_info

from tests.infrastructure.helpers.util import get_access_token


@pytest.mark.parametrize("user_id", [("seta_admin")])
def test_get_account_info(
    client: FlaskClient, authentication_url: str, user_key_pairs: dict, user_id: str
):
    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    response = get_account_info(client=client, access_token=access_token)
    assert response.status_code == HTTPStatus.OK
    assert "external_providers" in response.json


@pytest.mark.parametrize("user_id", [("seta_admin")])
def test_get_user_info(
    client: FlaskClient, authentication_url: str, user_key_pairs: dict, user_id: str
):
    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    response = get_user_info(client=client, access_token=access_token)
    assert response.status_code == HTTPStatus.OK
    assert "email" in response.json
