import pytest
from flask.testing import FlaskClient
from http import HTTPStatus

from tests.infrastructure.helpers.util import auth_headers
from tests.infrastructure.helpers.authentication import (login_user)


def get_by_term(client: FlaskClient, access_token:str, term: str, n_term: int = 6):
    url = f"/seta-api/api/v1/similar?term={term}&n_term={n_term}"
    
    return client.get(url, content_type="application/json", headers=auth_headers(access_token))

@pytest.mark.parametrize("user_id", ["seta_admin"])
@pytest.mark.parametrize("term", ["the", "Europe"])
def test_similar_terms(client: FlaskClient, user_id: str, term: str):
    """
    Test most similar terms
    """
    
    response = login_user(auth_url= client.application.config["JWT_TOKEN_AUTH_URL"], user_id=user_id)    
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]  
    
    response = get_by_term(client=client, access_token=access_token, term=term)
    assert response.status_code == HTTPStatus.OK
    #TODO: check response
    assert "words" in response.json
    
    