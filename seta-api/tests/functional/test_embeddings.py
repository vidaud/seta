import pytest
from flask.testing import FlaskClient
from http import HTTPStatus

from tests.infrastructure.helpers.util import auth_headers
from tests.infrastructure.helpers.authentication import login_user

from tests.infrastructure.helpers.util import get_access_token


def post_text(client: FlaskClient, access_token: str):
    text = "Ocean energy thematic network to present results"

    url = f"/seta-api/api/v1/compute_embeddings?text={text}"

    return client.post(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


@pytest.mark.parametrize("user_id", ["seta_admin"])
def test_embeddings_text(client: FlaskClient, user_key_pairs: dict, user_id: str):
    """
    Test related embeddings for a given text
    """

    authentication_url = client.application.config["JWT_TOKEN_AUTH_URL"]
    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    response = post_text(client=client, access_token=access_token)
    assert response.status_code == HTTPStatus.OK
    # TODO: check response
