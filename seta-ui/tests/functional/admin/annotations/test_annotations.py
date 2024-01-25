from http import HTTPStatus
import pytest
from flask.testing import FlaskClient
from flask_jwt_extended import create_access_token

from tests.infrastructure.helpers.authentication import login_user
from tests.functional.admin.annotations import api

from tests.infrastructure.helpers.util import get_access_token


@pytest.mark.parametrize("user_id", [("seta_admin")])
def test_create_annotation(
    client: FlaskClient, authentication_url: str, user_key_pairs: dict, user_id: str
):
    """Test creating a new annotation with admin rights."""

    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    # Make the request
    response = api.create_annotation(
        client=client,
        access_token=access_token,
        payload={"label": "test", "color": "#000000", "category": "test"},
    )

    # Assertions
    assert response.status_code == HTTPStatus.CREATED
    assert response.json["status"] == "success"
    assert "message" in response.json


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


def test_get_all_annotations_insufficient_rights(client: FlaskClient):
    """Test get all annotations with insufficient rights."""

    # Create a non-admin access token
    access_token = create_access_token(identity={"user_id": "non_admin_user"})

    response = api.get_all_annotations(client=client, access_token=access_token)
    assert response.status_code == HTTPStatus.FORBIDDEN
    assert response.json["message"] == "Insufficient rights."


@pytest.mark.parametrize("user_id", [("seta_admin")])
def test_update_annotation(
    client: FlaskClient, authentication_url: str, user_key_pairs: dict, user_id: str
):
    """Test update annotation."""

    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    response = api.update_annotation(
        client=client,
        access_token=access_token,
        label="test",
        payload={"color": "#ccc", "category": "test1"},
    )
    assert response.status_code == HTTPStatus.OK
    assert response.json["status"] == "success"
    assert "message" in response.json


@pytest.mark.parametrize("user_id", [("seta_admin")])
def test_delete_annotation(
    client: FlaskClient, authentication_url: str, user_key_pairs: dict, user_id: str
):
    """Test delete annotation."""

    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    response = api.delete_annotation(
        client=client, access_token=access_token, label="test"
    )
    assert response.status_code == HTTPStatus.OK
    assert response.json["status"] == "success"
    assert "message" in response.json
