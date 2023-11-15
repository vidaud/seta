from http import HTTPStatus
import pytest
from flask.testing import FlaskClient

from tests.infrastructure.helpers.authentication import login_user
from tests.infrastructure.helpers.profile import (
    get_unsearchable_resources,
    manage_unsearchable_resources,
)

from tests.infrastructure.helpers.util import get_access_token


@pytest.mark.parametrize("user_id, resources", [("seta_admin", "resource1,resource2")])
def test_restricted_resources(
    client: FlaskClient,
    authentication_url: str,
    user_key_pairs: dict,
    user_id: str,
    resources: str,
):
    """Manage unsearchable resources."""

    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    response = manage_unsearchable_resources(
        client=client, access_token=access_token, resource_ids=resources.split(",")
    )
    assert response.status_code == HTTPStatus.OK

    response = get_unsearchable_resources(client=client, access_token=access_token)
    assert response.status_code == HTTPStatus.OK
    assert len(response.json) == 2

    # delete resources
    response = manage_unsearchable_resources(
        client=client, access_token=access_token, resource_ids=[]
    )
    assert response.status_code == HTTPStatus.OK

    response = get_unsearchable_resources(client=client, access_token=access_token)
    assert response.status_code == HTTPStatus.OK
    assert not response.json
