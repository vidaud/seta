from http import HTTPStatus
import pytest
from flask.testing import FlaskClient

from tests.infrastructure.helpers.authentication import login_user
from tests.infrastructure.helpers.profile import (
    create_rsa_key,
    get_rsa_key,
    delete_rsa_key,
)

from tests.infrastructure.helpers.util import get_access_token


@pytest.mark.parametrize("user_id", [("seta_admin")])
def test_get_rsa_key(
    client: FlaskClient, authentication_url: str, user_key_pairs: dict, user_id: str
):
    """Gets the current public key"""

    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    response = get_rsa_key(client=client, access_token=access_token)
    assert response.status_code == HTTPStatus.OK
    assert "publicKey" in response.json


@pytest.mark.parametrize("user_id", [("seta_admin")])
def test_generate_rsa_key(
    client: FlaskClient, authentication_url: str, user_key_pairs: dict, user_id: str
):
    """Deletes the current public key and generates a new one"""

    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    response = delete_rsa_key(client=client, access_token=access_token)
    assert response.status_code == HTTPStatus.OK
    assert "status" in response.json

    response = create_rsa_key(client=client, access_token=access_token)
    assert response.status_code == HTTPStatus.OK
    assert "privateKey" in response.json
