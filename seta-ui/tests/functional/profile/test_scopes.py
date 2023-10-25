from http import HTTPStatus
import pytest
from flask.testing import FlaskClient

from tests.infrastructure.helpers.authentication import login_user
from tests.infrastructure.helpers.profile import get_permissions


@pytest.mark.parametrize("user_id", [("seta_admin")])
def test_get_account_info(client: FlaskClient, authentication_url: str, user_id: str):
    response = login_user(auth_url=authentication_url, user_id=user_id)
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]

    response = get_permissions(client=client, access_token=access_token)
    assert response.status_code == HTTPStatus.OK
    assert "system_scopes" in response.json
