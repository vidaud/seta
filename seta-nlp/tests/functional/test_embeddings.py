import pytest

from fastapi import status
from fastapi.testclient import TestClient

from tests.infrastructure.helpers.util import auth_headers
from tests.infrastructure.helpers.authentication import login_user

from tests.infrastructure.helpers.util import get_access_token


@pytest.mark.parametrize("user_id", ["seta_admin"])
def test_embeddings(
    client: TestClient, authentication_url: str, user_key_pairs: dict, user_id: str
):
    """
    Test related embeddings for a given text
    """

    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    payload = {"text": "Ocean energy thematic network to present results"}

    response = client.post(
        url="/compute_embeddings",
        headers=auth_headers(access_token),
        json=payload,
        timeout=10,
    )
    assert response.status_code == status.HTTP_200_OK
    assert "emb_with_chunk_text" in response.json()


@pytest.mark.parametrize("user_id", ["seta_admin"])
def test_embedding(
    client: TestClient, authentication_url: str, user_key_pairs: dict, user_id: str
):
    """
    Test related embedding for a given text
    """

    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    payload = {"text": "Ocean energy thematic network to present results"}

    response = client.post(
        url="/compute_embedding",
        headers=auth_headers(access_token),
        json=payload,
        timeout=10,
    )
    assert response.status_code == status.HTTP_200_OK
    assert "vector" in response.json()
