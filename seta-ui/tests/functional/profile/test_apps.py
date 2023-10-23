from http import HTTPStatus
import pytest
from flask.testing import FlaskClient

from tests.infrastructure.helpers.authentication import login_user
from tests.infrastructure.helpers.profile import (
    create_app,
    get_app,
    get_user_apps,
    update_app,
)


@pytest.mark.parametrize("user_id, app_name", [("seta_admin", "app_test")])
def test_create_app(
    client: FlaskClient, authentication_url: str, user_id: str, app_name: str
):
    response = login_user(auth_url=authentication_url, user_id=user_id)
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]

    response = create_app(
        client=client,
        access_token=access_token,
        name=app_name,
        description="Test app",
        copy_public_key=True,
        copy_resource_scopes=False,
    )
    assert response.status_code == HTTPStatus.CREATED


@pytest.mark.parametrize("user_id, app_name", [("seta_admin", "app_test")])
def test_get_app(
    client: FlaskClient, authentication_url: str, user_id: str, app_name: str
):
    response = login_user(auth_url=authentication_url, user_id=user_id)
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]

    response = get_app(client=client, access_token=access_token, name=app_name)
    assert response.status_code == HTTPStatus.OK
    assert "description" in response.json


@pytest.mark.parametrize("user_id", [("seta_admin")])
def test_get_user_apps(client: FlaskClient, authentication_url: str, user_id: str):
    response = login_user(auth_url=authentication_url, user_id=user_id)
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]

    response = get_user_apps(client=client, access_token=access_token)
    assert response.status_code == HTTPStatus.OK
    assert response.json


@pytest.mark.parametrize("user_id, app_name", [("seta_admin", "app_test")])
def test_update_app(
    client: FlaskClient, authentication_url: str, user_id: str, app_name: str
):
    response = login_user(auth_url=authentication_url, user_id=user_id)
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]

    new_name = app_name + "_updated"
    description = "Test update"

    response = update_app(
        client=client,
        access_token=access_token,
        name=app_name,
        new_name=new_name,
        description=description,
    )
    assert response.status_code == HTTPStatus.OK

    response = get_app(client=client, access_token=access_token, name=new_name)
    assert response.status_code == HTTPStatus.OK
    assert "description" in response.json
    assert response.json["description"] == description
