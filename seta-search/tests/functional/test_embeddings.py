from http import HTTPStatus

import requests
import pytest
from flask.testing import FlaskClient

from tests.infrastructure.helpers.util import auth_headers
from tests.infrastructure.helpers.authentication import login_user

from tests.infrastructure.helpers.util import get_access_token


def post_text(access_token: str, nlp_url: str):
    """Compute embeddings for a given text."""

    payload = {"text": "Ocean energy thematic network to present results"}

    url = f"{nlp_url}compute_embeddings"

    return requests.post(
        url=url, headers=auth_headers(access_token), json=payload, timeout=10
    )


@pytest.mark.parametrize("user_id", ["seta_admin"])
def test_embeddings_text(
    client: FlaskClient, user_key_pairs: dict, user_id: str, nlp_url: str
):
    """
    Test related embeddings for a given text
    """

    authentication_url = client.application.config["JWT_TOKEN_AUTH_URL"]
    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    response = post_text(access_token=access_token, nlp_url=nlp_url)
    assert response.status_code == HTTPStatus.OK
    assert "emb_with_chunk_text" in response.json()
