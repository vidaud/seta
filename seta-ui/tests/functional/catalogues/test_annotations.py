from http import HTTPStatus
import pytest
from flask.testing import FlaskClient

from tests.infrastructure.helpers.authentication import login_user
from tests.functional.catalogues import api

from tests.infrastructure.helpers.util import get_access_token


@pytest.mark.parametrize("user_id", [("seta_admin")])
def test_get_all_annotations(
    client: FlaskClient, authentication_url: str, user_key_pairs: dict, user_id: str
):
    """Test get all annotations."""

    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    response = api.get_all_annotations(client=client, access_token=access_token)
    assert response.status_code == HTTPStatus.OK
