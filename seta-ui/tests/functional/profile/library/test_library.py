from http import HTTPStatus
import pytest
from flask.testing import FlaskClient

from tests.infrastructure.helpers.authentication import login_user
from tests.infrastructure.helpers.util import get_access_token
from tests.functional.profile.library import api


@pytest.mark.parametrize("user_id", [("seta_admin")])
def test_create_library_items(
    client: FlaskClient, authentication_url: str, user_key_pairs: dict, user_id: str
):
    """Test creating library items"""

    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    folder_payload = [{"parentId": None, "title": "Test", "type": 0}]
    response = api.create_library_items(
        client=client, access_token=access_token, payload=folder_payload
    )

    assert response.status_code == HTTPStatus.CREATED
    assert len(response.json) == 1
    assert response.json[0]["title"] == "Test"
    assert "id" in response.json[0]

    # Prepare the payload for creating library items
    payload = [
        {
            "documentId": "fnGaOowBgyQjh16U_Xev",
            "id": "3ybGZEAWRAJg",
            "link": "https://cordis.europa.eu/article/rcn/435875",
            "parentId": response.json[0]["id"],
            "title": "Public health: empowering citizens to monitor urban pollution",
            "type": 1,
        },
        {
            "documentId": "K3GdOowBgyQjh16UUH00",
            "id": "6rompMeSjZyR",
            "link": "https://cordis.europa.eu/article/rcn/442416",
            "parentId": response.json[0]["id"],
            "title": "Shedding new light on metalloproteins",
            "type": 1,
        },
    ]

    response = api.create_library_items(
        client=client, access_token=access_token, payload=payload
    )

    assert response.status_code == HTTPStatus.CREATED
    assert len(response.json) == 2  # Check if the correct number of items were created


@pytest.mark.parametrize("user_id", [("seta_admin")])
def test_get_library_tree(
    client: FlaskClient, authentication_url: str, user_key_pairs: dict, user_id: str
):
    """Test getting library tree."""

    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    response = api.get_library_tree(client=client, access_token=access_token)
    assert response.status_code == HTTPStatus.OK
    assert "items" in response.json


@pytest.mark.parametrize("user_id", [("seta_admin")])
def test_update_library_item(
    client: FlaskClient, authentication_url: str, user_key_pairs: dict, user_id: str
):
    """Test updating library item."""

    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    payload = {
        "documentId": "1",
        "link": "https://test.com",
        "parentId": None,
        "title": "Test update",
    }

    response = api.get_library_tree(client=client, access_token=access_token)
    assert len(response.json["items"]) > 0
    assert "children" in response.json["items"][0]
    assert len(response.json["items"][0]["children"]) > 0
    item_id = response.json["items"][0]["children"][0]["id"]

    response = api.update_library_item(
        client=client, access_token=access_token, item_id=item_id, payload=payload
    )
    assert response.status_code == HTTPStatus.OK


@pytest.mark.parametrize("user_id", [("seta_admin")])
def test_delete_library_item(
    client: FlaskClient, authentication_url: str, user_key_pairs: dict, user_id: str
):
    """Test delete library item."""

    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    response = api.get_library_tree(client=client, access_token=access_token)
    assert len(response.json["items"]) > 0
    assert "children" in response.json["items"][0]
    assert len(response.json["items"][0]["children"]) > 0
    item_id = response.json["items"][0]["children"][0]["id"]

    response = api.delete_library_item(
        client=client, access_token=access_token, item_id=item_id
    )
    assert response.status_code == HTTPStatus.OK
