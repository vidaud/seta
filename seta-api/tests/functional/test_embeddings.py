import pytest
from flask.testing import FlaskClient
from http import HTTPStatus

from tests.infrastructure.helpers.util import auth_headers
from tests.infrastructure.helpers.authentication import (login_user)


def post_text(client: FlaskClient, access_token:str):
    text = "Ocean energy thematic network to present results"
    
    url = f"/seta-api/api/v1/compute_embeddings?text={text}"    
    
    return client.post(url, content_type="application/json", headers=auth_headers(access_token))

@pytest.mark.parametrize("user_id", ["seta_admin"])
def test_embeddings_text(client: FlaskClient, user_id: str):
    """
    Test related embeddings for a given text
    """
    
    response = login_user(auth_url= client.application.config["JWT_TOKEN_AUTH_URL"], user_id=user_id)    
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]  
    
    response = post_text(client=client, access_token=access_token)
    assert response.status_code == HTTPStatus.OK
    #TODO: check response
    assert "embeddings" in response.json
    
    