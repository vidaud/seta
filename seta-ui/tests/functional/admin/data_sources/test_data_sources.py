from http import HTTPStatus
import pytest
from flask.testing import FlaskClient

from tests.infrastructure.helpers.authentication import login_user
from tests.functional.admin.data_sources import api

from tests.infrastructure.helpers.util import get_access_token

new_data_source = {
    "pubsy": {
        "id": "pubsy",
        "title": "Pubsy",
        "description": "Pubsy description",
        "organisation": "Pubsy",
        "themes": ["theme1", "theme2"],
        "contact": {
            "email": "a@a.com",
            "person": "Test Person",
            "website": "http://pubsy.com",
        },
        "index": "seta-public-000001",
    },
    "test": {
        "id": "test",
        "title": "_test_",
        "description": "Some test for data source insert",
        "organisation": "Test organisation",
        "themes": ["theme test"],
        "contact": {
            "email": "a@a.com",
            "person": "Test Person",
            "website": "http://test.com",
        },
        "index": "seta-public-000001",
    },
    "fail_duplicate_id": {
        "id": "pubsy",
        "title": "Pubsy duplicate",
        "description": "Pubsy duplicate",
        "organisation": "Pubsy",
        "themes": ["theme1"],
        "contact": {
            "email": "a@a.com",
            "person": "Test Person",
            "website": "http://test.com",
        },
        "index": "seta-public-000001",
    },
}

update_data_sources = {
    "test": {
        "title": "test",
        "description": "Some test for data source update",
        "organisation": "Organisation test",
        "themes": ["theme test"],
        "contact": {
            "email": "bb@bb.com",
            "person": "Test Person Update",
            "website": "http://test.test",
        },
        "status": "archived",
    }
}


@pytest.mark.parametrize(
    "user_id, key, expect",
    [
        ("seta_admin", "pubsy", HTTPStatus.CREATED),
        ("seta_admin", "test", HTTPStatus.CREATED),
        ("seta_admin", "fail_duplicate_id", HTTPStatus.BAD_REQUEST),
    ],
)
def test_create_data_source(
    client: FlaskClient,
    authentication_url: str,
    user_key_pairs: dict,
    user_id: str,
    key: str,
    expect: int,
):
    """Create data source."""

    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    payload = new_data_source[key]
    response = api.create_data_source(
        client=client, access_token=access_token, payload=payload
    )
    assert response.status_code == expect


@pytest.mark.parametrize("user_id", [("seta_admin")])
def test_get_all_data_sources(
    client: FlaskClient, authentication_url: str, user_key_pairs: dict, user_id: str
):
    """Retrieves all data sources."""

    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    response = api.get_data_sources(client=client, access_token=access_token)
    assert response.status_code == HTTPStatus.OK

    assert len(response.json) > 0


@pytest.mark.parametrize(
    "user_id, data_source_id, expect",
    [
        ("seta_admin", "test", HTTPStatus.OK),
    ],
)
def test_update_data_source(
    client: FlaskClient,
    authentication_url: str,
    user_key_pairs: dict,
    user_id: str,
    data_source_id: str,
    expect: int,
):
    """Update data source."""

    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    payload = update_data_sources[data_source_id]
    response = api.update_data_source(
        client=client,
        access_token=access_token,
        data_source_id=data_source_id,
        payload=payload,
    )
    assert response.status_code == expect
