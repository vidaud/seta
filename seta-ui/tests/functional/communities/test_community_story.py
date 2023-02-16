import pytest
from flask import json
from flask.testing import FlaskClient
from http import HTTPStatus

from tests.infrastructure.helpers.authentication import (generate_signature, login_user)
from tests.infrastructure.helpers.community import (create_community, get_community, update_community)
from tests.infrastructure.helpers.util import get_private_key
from seta_flask_server.repository.models import CommunityModel
   
'''==================== CREATE Community ======================================='''

@pytest.mark.parametrize("user_id", ["seta_admin"])
def test_create_community(client: FlaskClient, user_id: str):
    """
    Scenario: 'seta_admin' registers new data community

    Given: 'seta_admin' is authenticated users in SeTA
    When: 'seta_admin' is registering new data community with ID 'blue'
    Then: new data community 'blue' registration is confirmed
    """

    private_key = get_private_key(user_id)
    assert private_key is not None
    message, signature = generate_signature(private_key)
    
    response = login_user(client=client, user_id=user_id, message=message, signature=signature)    
    assert response.status_code == HTTPStatus.OK
    assert "access_token" in response.json
    access_token = response.json["access_token"]

    response = create_community(client=client, access_token=access_token, 
                    id="blue", title="Blue Community", description="Blue Community for test", data_type="representative")
    assert response.status_code == HTTPStatus.CREATED
    response = get_community(client=client, access_token=access_token, id="blue")
    assert response.status_code == HTTPStatus.OK

@pytest.mark.parametrize("user_id", ["seta_admin"])
def test_fail_create_community(client: FlaskClient, user_id: str):
    """
    Scenario: 'seta_admin' registers new data community with existing community ID

    Given: 'seta_admin' is authenticated users in SeTA
    When: 'seta_admin' is registering new data community with ID 'blue'
    Then: data community 'blue' registration is rejected
    """

    private_key = get_private_key(user_id)
    assert private_key is not None
    message, signature = generate_signature(private_key)
    
    response = login_user(client=client, user_id=user_id, message=message, signature=signature)
    assert response.status_code == HTTPStatus.OK
    assert "access_token" in response.json
    access_token = response.json["access_token"]

    response = create_community(client=client, access_token=access_token, 
                    id="blue", title="Blue Community", description="Blue Community for test", data_type="representative")
    assert response.status_code == HTTPStatus.CONFLICT

'''===========================================================''' 


'''==================== EDIT Community ======================================='''

@pytest.mark.parametrize("user_id", ["seta_admin"])
@pytest.mark.parametrize("community_id", ["blue"])
def test_update_community(client: FlaskClient, user_id: str, community_id: str):
    """
    Scenario: 'seta_admin' edits the description of data community 'blue'

    Given: 'seta_admin' is authenticated users in SeTA
    When: 'seta_admin' is changing the description of data community 'blue'
    Then: the description of data community 'blue' is updated
    """

    new_description = "Community Update Test"

    private_key = get_private_key(user_id)
    assert private_key is not None
    message, signature = generate_signature(private_key)
    
    response = login_user(client=client, user_id=user_id, message=message, signature=signature)    
    assert response.status_code == HTTPStatus.OK
    assert "access_token" in response.json
    access_token = response.json["access_token"]

    response = get_community(client=client, access_token=access_token, id=community_id)
    assert response.status_code == HTTPStatus.OK
   
    community_json = response.json

    response = update_community(client=client, access_token=access_token, 
                    id=community_id, title=community_json["title"], description=new_description, 
                    data_type=community_json["data_type"], status=community_json["status"])
    assert response.status_code == HTTPStatus.OK
        
    response = get_community(client=client, access_token=access_token, id=community_id)
    assert response.status_code == HTTPStatus.OK
    assert "description" in response.json
    assert response.json["description"] == new_description

@pytest.mark.parametrize("user_id", ["seta_community_manager"])
@pytest.mark.parametrize("community_id", ["blue"])
def test_fail_update_community(client: FlaskClient, user_id: str, community_id: str):
    """
    Scenario: 'user2' edits the description of data community 'blue'

    Given: 'user2' is authenticated users in SeTA
    When: 'user2' is changing the description of data community 'blue'
    Then: the description of data community 'blue' update is rejected because user2 has no required grants
    """

    new_description = "Community Update Test"

    private_key = get_private_key(user_id)
    assert private_key is not None
    message, signature = generate_signature(private_key)
    
    response = login_user(client=client, user_id=user_id, message=message, signature=signature)    
    assert response.status_code == HTTPStatus.OK
    assert "access_token" in response.json
    access_token = response.json["access_token"]

    response = get_community(client=client, access_token=access_token, id=community_id)
    assert response.status_code == HTTPStatus.OK
   
    community_json = response.json

    response = update_community(client=client, access_token=access_token, 
                    id=community_id, title=community_json["title"], description=new_description, 
                    data_type=community_json["data_type"], status=community_json["status"])
    assert response.status_code == HTTPStatus.FORBIDDEN

@pytest.mark.parametrize("user_id", ["seta_admin"])
@pytest.mark.parametrize("community_id", ["red"])
def test_fail_non_existing_community(client: FlaskClient, user_id: str, community_id: str):
    """
    Scenario: 'user1' edits the description of nonexisting data community 'red'

    Given: 'user1' is authenticated users in SeTA
    When: 'user1' is changing the description of data community 'red'
    Then: the descprition of data community 'red' is rejected because data community 'red' does not exist.
    """

    private_key = get_private_key(user_id)
    assert private_key is not None
    message, signature = generate_signature(private_key)
    
    response = login_user(client=client, user_id=user_id, message=message, signature=signature)    
    assert response.status_code == HTTPStatus.OK
    assert "access_token" in response.json
    access_token = response.json["access_token"]

    response = update_community(client=client, access_token=access_token, 
                    id=community_id, title="title", description="description", 
                    data_type="representative", status="active")
    assert response.status_code == HTTPStatus.NO_CONTENT    
         

'''==========================================================='''       