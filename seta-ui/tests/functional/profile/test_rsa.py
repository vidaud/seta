import pytest
from flask.testing import FlaskClient
from http import HTTPStatus

from tests.infrastructure.helpers.authentication import (login_user)
from tests.infrastructure.helpers.profile import (create_rsa_key, get_rsa_key, delete_rsa_key)
    
@pytest.mark.parametrize("user_id", [("seta_admin")])
def test_get_rsa_key(client: FlaskClient, authentication_url:str, user_id: str):
    """Gets the current public key"""
    
    response = login_user(auth_url=authentication_url, user_id=user_id)    
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]
    
    response = get_rsa_key(client=client, access_token=access_token)
    assert response.status_code == HTTPStatus.OK
    assert "value" in response.json
    
@pytest.mark.parametrize("user_id", [("seta_admin")])
def test_generate_rsa_key(client: FlaskClient, authentication_url:str, user_id: str):
    """Deletes the current public key and generates a new one"""        
    
    response = login_user(auth_url=authentication_url, user_id=user_id)    
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]
    
    response = delete_rsa_key(client=client, access_token=access_token)
    assert response.status_code == HTTPStatus.OK
    assert "status" in response.json
    
    response = create_rsa_key(client=client, access_token=access_token)
    assert response.status_code == HTTPStatus.OK
    assert "privateKey" in response.json