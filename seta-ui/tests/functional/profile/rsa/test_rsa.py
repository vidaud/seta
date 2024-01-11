from http import HTTPStatus
import pytest
from flask.testing import FlaskClient

from tests.infrastructure.helpers.authentication import login_user
from tests.functional.profile.rsa import api

from tests.infrastructure.helpers.util import get_access_token, get_public_key


@pytest.mark.parametrize("user_id", [("seta_admin")])
def test_get_rsa_key(
    client: FlaskClient, authentication_url: str, user_key_pairs: dict, user_id: str
):
    """Gets the current public key"""

    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    response = api.get_rsa_key(client=client, access_token=access_token)
    assert response.status_code == HTTPStatus.OK
    assert "publicKey" in response.json


@pytest.mark.parametrize("user_id", ["seta_admin"])
def test_store_rsa_key(
    client: FlaskClient, authentication_url: str, user_key_pairs: dict, user_id: str
):
    """Deletes the current public key and store a new one"""

    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    response = api.delete_rsa_key(client=client, access_token=access_token)
    assert response.status_code == HTTPStatus.OK
    assert "status" in response.json

    response = api.create_rsa_key(
        client=client,
        access_token=access_token,
        public_key=get_public_key(user_id, user_key_pairs),
    )
    assert response.status_code == HTTPStatus.OK
