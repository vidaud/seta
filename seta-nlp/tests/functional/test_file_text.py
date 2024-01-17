from pathlib import Path
import httpx
import pytest

from fastapi import status

from tests.infrastructure.helpers.util import auth_headers
from tests.infrastructure.helpers.authentication import login_user

from tests.infrastructure.helpers.util import get_access_token


@pytest.mark.parametrize("user_id", ["seta_admin"])
def test_file_to_text(
    authentication_url: str,
    user_key_pairs: dict,
    user_id: str,
    nlp_url: str,
):
    """Test file to text parser.

    Use remote endpoint for file to text parser.
    """

    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    base_path = Path(__file__).parent
    test_file_path = "../infrastructure/data/test_file_to_text.txt"
    test_full_path = (base_path / test_file_path).resolve()

    with open(test_full_path, "rb") as file:
        response = httpx.post(
            url=f"{nlp_url}/file_to_text",
            headers=auth_headers(access_token),
            files={"file": file},
            timeout=10,
        )
        assert response.status_code == status.HTTP_200_OK
        # ? file parser appends a new line at the end
        assert response.text == "This is a test file to text.\n"
