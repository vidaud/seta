from http import HTTPStatus
import pytest
from flask.testing import FlaskClient

from tests.infrastructure.helpers.authentication import login_user
from tests.functional.admin.rolling_indexes import api

from seta_flask_server.repository.models import RollingIndex, StorageLimits

new_rolling_indexes = {
    "jrc": RollingIndex(
        rolling_index_name="jrc",
        title="JRC",
        description="JRC rolling index",
        limits=StorageLimits(total_storage_gb=200),
        community_ids=["seta1", "seta2"],
    ),
    "digit": RollingIndex(
        rolling_index_name="digit",
        title="Digit",
        description="digit rolling index",
        limits=StorageLimits(total_storage_gb=400),
        community_ids=["digit1", "digit2"],
    ),
    "fail_comm": RollingIndex(
        rolling_index_name="fail_comm",
        title="fail_comm",
        description="Fail community list",
        limits=StorageLimits(total_storage_gb=400),
        community_ids=["seta1"],
    ),
}

update_rolling_indexes = {
    "jrc": RollingIndex(
        rolling_index_name="jrc",
        title="JRC",
        description="JRC communities rolling index",
        limits=StorageLimits(total_storage_gb=300),
    ),
    "digit": RollingIndex(
        rolling_index_name="digit",
        title="JRC",
        description="digit rolling index",
        limits=StorageLimits(total_storage_gb=200),
        is_disabled=True,
    ),
}


@pytest.mark.parametrize("user_id, name", [("seta_admin", "default")])
def test_get_all_rolling_indexes(
    client: FlaskClient, authentication_url: str, user_id: str, name: str
):
    """Retrieves all rolling indexes and validates name in result."""

    response = login_user(auth_url=authentication_url, user_id=user_id)
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]

    response = api.get_all_rolling_indexes(client=client, access_token=access_token)
    assert response.status_code == HTTPStatus.OK

    assert len(response.json) > 0

    default_index = next(
        filter(
            lambda ri: ri["name"] == name,
            response.json,
        ),
        None,
    )
    assert default_index is not None


@pytest.mark.parametrize(
    "user_id, key, expect",
    [
        ("seta_admin", "jrc", HTTPStatus.CREATED),
        ("seta_admin", "digit", HTTPStatus.CREATED),
        ("seta_admin", "fail_comm", HTTPStatus.BAD_REQUEST),
    ],
)
def test_create_rolling_index(
    client: FlaskClient, authentication_url: str, user_id: str, key: str, expect: int
):
    """Create rolling index."""

    response = login_user(auth_url=authentication_url, user_id=user_id)
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]

    rolling_index = new_rolling_indexes[key]
    response = api.create_rolling_index(
        client=client, access_token=access_token, rolling_index=rolling_index
    )
    assert response.status_code == expect


@pytest.mark.parametrize(
    "user_id, key, expect",
    [
        ("seta_admin", "jrc", HTTPStatus.OK),
        ("seta_admin", "digit", HTTPStatus.BAD_REQUEST),
    ],
)
def test_update_rolling_index(
    client: FlaskClient, authentication_url: str, user_id: str, key: str, expect: int
):
    """Update rolling index."""

    response = login_user(auth_url=authentication_url, user_id=user_id)
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]

    rolling_index = update_rolling_indexes[key]
    response = api.update_rolling_index(
        client=client, access_token=access_token, rolling_index=rolling_index
    )
    assert response.status_code == expect


@pytest.mark.parametrize(
    "user_id, name, expect",
    [
        ("seta_admin", "jrc", HTTPStatus.CREATED),
        ("seta_admin", "not_exists", HTTPStatus.NOT_FOUND),
    ],
)
def test_create_active_index(
    client: FlaskClient, authentication_url: str, user_id: str, name: str, expect: int
):
    """Test create active rolling index."""

    response = login_user(auth_url=authentication_url, user_id=user_id)
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]

    response = api.create_active_index(
        client=client, access_token=access_token, rolling_index_name=name
    )
    assert response.status_code == expect


@pytest.mark.parametrize(
    "user_id, name, communities, expect",
    [
        ("seta_admin", "jrc", "seta1,seta2,seta3", HTTPStatus.OK),
        ("seta_admin", "digit", "seta1,seta2", HTTPStatus.BAD_REQUEST),
    ],
)
def test_replace_communities(
    client: FlaskClient,
    authentication_url: str,
    user_id: str,
    name: str,
    communities: str,
    expect: int,
):
    """Test replace communities."""

    response = login_user(auth_url=authentication_url, user_id=user_id)
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]

    community_ids = communities.split(",")
    response = api.replace_communities(
        client=client,
        access_token=access_token,
        rolling_index_name=name,
        communities=community_ids,
    )
    assert response.status_code == expect
