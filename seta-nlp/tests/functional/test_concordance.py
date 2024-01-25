import pytest

from fastapi import status
from fastapi.testclient import TestClient

from tests.infrastructure.helpers.util import auth_headers
from tests.infrastructure.helpers.authentication import login_user

from tests.infrastructure.helpers.util import get_access_token


@pytest.mark.parametrize("user_id", ["seta_admin"])
def test_concordance(
    client: TestClient, authentication_url: str, user_key_pairs: dict, user_id: str
):
    """
    Test concordances for a given document
    """

    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    payload = {
        "abstract": "This is a test abstract",
        "term": "test",
        "text": "Test is something that is tested.",
    }

    response = client.post(
        url="/internal/compute_concordance",
        headers=auth_headers(access_token),
        json=payload,
        timeout=10,
    )
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) > 0
