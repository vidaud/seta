import pytest
from flask import json
from flask.testing import FlaskClient
from http import HTTPStatus

from tests.infrastructure.helpers.authentication import (login_user)
from tests.infrastructure.helpers.community import (create_community, get_community, update_community)
from tests.infrastructure.helpers.resource import (create_resource, get_resource, update_resource, delete_resource)
from tests.infrastructure.helpers.community_membership import (create_membership_request, get_membership_requests, update_membership_request)
   
'''==================== CREATE Community ======================================='''

@pytest.mark.parametrize("user_id", ["seta_admin"])
def test_create_community(client: FlaskClient, user_id: str):
    """
    Scenario: 'user1' registers new data community

    Given: 'user1' is authenticated users in SeTA
    When: 'user1' is registering new data community with ID 'blue'
    Then: new data community 'blue' registration is confirmed
    """
    
    response = login_user(client=client, user_id=user_id)    
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
    Scenario: 'user1' registers new data community with existing community ID

    Given: 'user1' is authenticated users in SeTA
    When: 'user1' is registering new data community with ID 'blue'
    Then: data community 'blue' registration is rejected
    """
    
    response = login_user(client=client, user_id=user_id)
    assert response.status_code == HTTPStatus.OK
    assert "access_token" in response.json
    access_token = response.json["access_token"]

    response = create_community(client=client, access_token=access_token, 
                    id="blue", title="Blue Community", description="Blue Community for test", data_type="representative")
    assert response.status_code == HTTPStatus.CONFLICT

'''===========================================================''' 


'''==================== EDIT Community ======================================='''

@pytest.mark.parametrize("user_id, community_id", [("seta_admin", "blue")])
def test_update_community(client: FlaskClient, user_id: str, community_id: str):
    """
    Scenario: 'user1' edits the description of data community 'blue'

    Given: 'user1' is authenticated users in SeTA
    When: 'user1' is changing the description of data community 'blue'
    Then: the description of data community 'blue' is updated
    """

    new_description = "Community Update Test"
    
    response = login_user(client=client, user_id=user_id)    
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

@pytest.mark.parametrize("user_id, community_id", [("seta_community_manager", "blue")])
def test_fail_update_community(client: FlaskClient, user_id: str, community_id: str):
    """
    Scenario: 'user2' edits the description of data community 'blue'

    Given: 'user2' is authenticated users in SeTA
    When: 'user2' is changing the description of data community 'blue'
    Then: the description of data community 'blue' update is rejected because user2 has no required grants
    """

    new_description = "Community Update Test"
    
    response = login_user(client=client, user_id=user_id)    
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

@pytest.mark.parametrize("user_id, community_id", [("seta_admin", "red")])
def test_fail_non_existing_community(client: FlaskClient, user_id: str, community_id: str):
    """
    Scenario: 'user1' edits the description of nonexisting data community 'red'

    Given: 'user1' is authenticated users in SeTA
    When: 'user1' is changing the description of data community 'red'
    Then: the descprition of data community 'red' is rejected because data community 'red' does not exist.
    """
    
    response = login_user(client=client, user_id=user_id)    
    assert response.status_code == HTTPStatus.OK
    assert "access_token" in response.json
    access_token = response.json["access_token"]

    response = update_community(client=client, access_token=access_token, 
                    id=community_id, title="title", description="description", 
                    data_type="representative", status="active")
    assert response.status_code == HTTPStatus.NO_CONTENT    
         

'''===========================================================''' 


'''==================== CREATE Resource ======================================='''
@pytest.mark.parametrize("user_id, community_id", [("seta_admin", "blue")])
def test_create_resource(client: FlaskClient, user_id: str, community_id: str):
    """
    Scenario: 'user1' is registering new data source 'ocean' in data community 'blue'

    Given: 'user1' is authenticated users in SeTA
         AND data community 'blue' is registered 
         AND 'user1' is the owner of data community 'blue'
    When: 'user1' is registering new data source  'ocean' in data community 'blue'
    Then: new data source 'ocean' in data community 'blue' registration is confirmed
    """

    
    response = login_user(client=client, user_id=user_id)    
    assert response.status_code == HTTPStatus.OK
    assert "access_token" in response.json
    access_token = response.json["access_token"]

    response = create_resource(client=client, access_token=access_token, community_id=community_id,
                    resource_id="ocean", title="Ocean", abstract="Ocean resource for test")
    assert response.status_code == HTTPStatus.CREATED


@pytest.mark.parametrize("user_id, community_id", [("seta_admin", "blue")])
def test_fail_create_resource(client: FlaskClient, user_id: str, community_id: str):
    """
    Scenario: 'user1' is re-registering new data source 'ocean' in data community 'blue'
    Given: 'user1' is authenticated users in SeTA
         AND data community 'blue' is registered 
         AND 'user1' is the owner of data community 'blue'
         AND data source 'ocean' is already registered in data community 'ocean'
    When: 'user1' is re-registering new data source  'ocean' in data community 'blue'
    Then: new data source 'ocean' in data community 'blue' registration is declined because data source already exists.
    """

    
    response = login_user(client=client, user_id=user_id)    
    assert response.status_code == HTTPStatus.OK
    assert "access_token" in response.json
    access_token = response.json["access_token"]

    response = create_resource(client=client, access_token=access_token, community_id=community_id,
                    resource_id="ocean", title="Ocean", abstract="Ocean resource for test")
    assert response.status_code == HTTPStatus.CONFLICT   

@pytest.mark.parametrize("user_id, community_id", [("seta_admin", "yellow")])
def test_fail_create_resource_non_existent_community(client: FlaskClient, user_id: str, community_id: str):
    """
    Scenario: 'user1' is re-registering new data source 'ocean' in data community 'blue'
    Given: 'user1' is authenticated users in SeTA
         AND data community 'blue' is registered 
         AND 'user1' is the owner of data community 'blue'
         AND data source 'ocean' is already registered in data community 'ocean'
    When: 'user1' is re-registering new data source  'ocean' in data community 'blue'
    Then: new data source 'ocean' in data community 'blue' registration is declined because data source already exists.
    """

    
    response = login_user(client=client, user_id=user_id)    
    assert response.status_code == HTTPStatus.OK
    assert "access_token" in response.json
    access_token = response.json["access_token"]

    response = create_resource(client=client, access_token=access_token, community_id=community_id,
                    resource_id="ocean", title="Ocean", abstract="Ocean resource for test")
    assert response.status_code == HTTPStatus.NO_CONTENT        

@pytest.mark.parametrize("user_id, community_id", [("seta_community_manager", "blue")])
def test_fail_create_resource_forbidden(client: FlaskClient, user_id: str, community_id: str):
    """
    Scenario: 'user2' is registering new data source 'sea' in data community 'blue'
    Given: 'user2' is authenticated users in SeTA
            AND data community 'blue' is registered 
            AND 'user2' has reader right in data community 'blue'
    When: 'user2' is registering new data source  'sea' in data community 'blue'
    Then: new data source 'sea' in data community 'blue' registration is declined because 'user2' does not have enought permissions.
    """

    
    response = login_user(client=client, user_id=user_id)    
    assert response.status_code == HTTPStatus.OK
    assert "access_token" in response.json
    access_token = response.json["access_token"]

    response = create_resource(client=client, access_token=access_token, community_id=community_id,
                    resource_id="sea", title="Sea", abstract="Sea resource for test")
    assert response.status_code == HTTPStatus.FORBIDDEN  

'''==========================================================='''

'''==================== EDIT Resource ======================================='''
@pytest.mark.parametrize("user_id, resource_id", [("seta_admin", "ocean")])
def test_update_resource(client: FlaskClient, user_id: str, resource_id: str):
    """
    Scenario: 'user1' edits the description of resource 'ocean'

    Given: 'user1' is authenticated users in SeTA
    When: 'user1' is changing the description of resource 'ocean'
    Then: the description of resource 'ocean' is updated
    """

    new_description = "Resource Update Test"
    
    response = login_user(client=client, user_id=user_id)    
    assert response.status_code == HTTPStatus.OK
    assert "access_token" in response.json
    access_token = response.json["access_token"]

    response = get_resource(client=client, access_token=access_token, resource_id=resource_id)
    assert response.status_code == HTTPStatus.OK
   
    resource_json = response.json

    response = update_resource(client=client, access_token=access_token, 
                    resource_id=resource_id, title=resource_json["title"], abstract=new_description, status=resource_json["status"])
    assert response.status_code == HTTPStatus.OK
        
    response = get_resource(client=client, access_token=access_token, resource_id=resource_id)
    assert response.status_code == HTTPStatus.OK
    assert "abstract" in response.json
    assert response.json["abstract"] == new_description

@pytest.mark.parametrize("user_id, resource_id", [("seta_community_manager", "ocean")])
def test_fail_update_resource(client: FlaskClient, user_id: str, resource_id: str):
    """
    Scenario: 'user2' edits the description of resource 'ocean'

    Given: 'user2' is authenticated users in SeTA
    When: 'user2' is changing the description of resource 'ocean'
    Then: the description of resource 'ocean' update is rejected because user2 has no required grants
    """

    new_description = "Resource Update Test"
    
    response = login_user(client=client, user_id=user_id)    
    assert response.status_code == HTTPStatus.OK
    assert "access_token" in response.json
    access_token = response.json["access_token"]

    response = get_resource(client=client, access_token=access_token, resource_id=resource_id)
    assert response.status_code == HTTPStatus.OK
   
    resource_json = response.json

    response = update_resource(client=client, access_token=access_token, 
                    resource_id=resource_id, title=resource_json["title"], abstract=new_description, status=resource_json["status"])
    assert response.status_code == HTTPStatus.FORBIDDEN
'''===========================================================''' 

'''==================== Join Requests ======================================='''

@pytest.mark.parametrize("user_id, community_id", [("seta_community_manager", "blue")])
def test_create_join_request(client: FlaskClient, user_id: str, community_id: str):
    """
    Scenario: 'user2' sends request to join 'blue' community

    Given: 'user2' is authenticated users in SeTA
         AND data community 'blue' is registered 
    When: 'user2' is requesting to join community 'blue'
    Then: new request registration is confirmed
    """

    
    response = login_user(client=client, user_id=user_id)    
    assert response.status_code == HTTPStatus.OK
    assert "access_token" in response.json
    access_token = response.json["access_token"]

    response = create_membership_request(client=client, access_token=access_token, community_id=community_id,
                    message="I want to become a member of your community!")
    assert response.status_code == HTTPStatus.CREATED

@pytest.mark.parametrize("user_id, community_id", [("seta_admin", "blue"), 
        pytest.param("seta_community_manager", "blue", marks=pytest.mark.xfail)])
def test_get_community_join_requests(client: FlaskClient, user_id: str, community_id: str):
    """
    Scenario: 'user1' gets the join requests list for community 'blue'

    Given: 'user_id' is authenticated users in SeTA
         AND data community 'community_id' is registered 
    When: 'user_id' is requesting the list of join requests of community 'community'
    Then: gets the list or fail because insufficient rights
    """

    
    response = login_user(client=client, user_id=user_id)    
    assert response.status_code == HTTPStatus.OK
    assert "access_token" in response.json
    access_token = response.json["access_token"]

    response = get_membership_requests(client=client, access_token=access_token, community_id=community_id)
    assert response.status_code == HTTPStatus.OK
    assert len(response.json) > 0

@pytest.mark.parametrize("user_id, community_id, request_id", [ 
        pytest.param("seta_community_manager", "blue", "seta_community_manager", marks=pytest.mark.xfail),
        pytest.param("seta_admin", "blue", "seta_community_manager"),
        pytest.param("seta_admin", "blue", "seta_community_manager", marks=pytest.mark.xfail),
        ])
def test_update_membership_request(client: FlaskClient, user_id: str, community_id: str, request_id: str):
    """
    user2: confirm 'user2' request to join community 'blue' - result FAILED
    user1: confirm 'user2' request to join community 'blue' - result SUCCESS
    user1: confirm 'user2' request to join community 'blue' - result FAILED
    """
    
    response = login_user(client=client, user_id=user_id)    
    assert response.status_code == HTTPStatus.OK
    assert "access_token" in response.json
    access_token = response.json["access_token"]

    response = update_membership_request(client=client, access_token=access_token, community_id=community_id, user_id=request_id, status="approved")
    assert response.status_code == HTTPStatus.OK

'''==========================================================='''