import pytest
from flask.testing import FlaskClient
from http import HTTPStatus
import requests
import time

from tests.infrastructure.helpers.authentication import login_user
from tests.infrastructure.helpers.community import create_community
from tests.infrastructure.helpers.resource import create_resource

def add_document(url: str):
    data = {"source": "orphan", "mime_type": "URL", "language": "en", "id": "orphan:article:1", "id_alias": "ORPHAN:article:1", 
            "title": "Test orphan resource", 
            "abstract": "This is a test for an orphan resource", 
            "text": "This is a test for an orphan resource", 
            "date": "1990-02-07", "collection": "news;News", "link_origin": "https://jrc.ec.europa.eu", 
            "other": {"crc": "b724e9f86a0cfccbcdaf9a4b70b7988ffac668140d4cdedc5f5b5654da9d7e39"}}
    
    return requests.put(url, json=data)

@pytest.mark.parametrize("user_id, community_id, resource_id", [("seta_admin", "blue", "orphan")])
def test_orphan(client: FlaskClient, authentication_url: str, seta_api_corpus: str, user_id: str, community_id: str, resource_id: str):
    response = add_document(url=seta_api_corpus)
    assert response.status_code == HTTPStatus.OK
    assert "document_id" in response.json()
    
    #wait for commit in ES
    time.sleep(2)    

    response = login_user(auth_url=authentication_url, user_id=user_id)    
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]
    
    response = create_community(client=client, access_token=access_token, 
                    id="blue", title="Blue Community", description="Blue Community for test", data_type="representative")
    assert response.status_code == HTTPStatus.CREATED
    
    response = create_resource(client=client, access_token=access_token, community_id=community_id,
                    resource_id=resource_id, title=resource_id, abstract=resource_id)
    assert response.status_code == HTTPStatus.CONFLICT