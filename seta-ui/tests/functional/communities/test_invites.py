import pytest
from flask.testing import FlaskClient
from http import HTTPStatus
from flask import json

from tests.infrastructure.helpers.authentication import (login_user)
from tests.infrastructure.helpers.community import (create_community)
from tests.infrastructure.helpers.community_invite import (create_community_invite, get_community_pending_invites, get_invite, update_invite)
from tests.infrastructure.helpers.community_membership import (get_membership)

from seta_flask_server.infrastructure.constants import (InviteStatusConstants)

'''==================== Community ======================================='''
@pytest.mark.parametrize("user_id", ["seta_admin"])
def test_create_community(client: FlaskClient, authentication_url:str, user_id: str):
    """
    Scenario: 'user1' registers new data community

    Given: 'user1' is authenticated users in SeTA
    When: 'user1' is registering new data community with ID 'blue'
    Then: new data community 'blue' registration is confirmed
    """
    
    response = login_user(auth_url=authentication_url, user_id=user_id)    
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]

    response = create_community(client=client, access_token=access_token, 
                    id="blue", title="Blue Community", description="Blue Community for test")
    assert response.status_code == HTTPStatus.CREATED
'''===========================================================''' 

'''==================== Invite ======================================='''   
@pytest.mark.parametrize("user_id, community_id, email, expected", [("seta_admin", "blue", "seta_community_manager@localtest.eu", HTTPStatus.CREATED),                    
                    ("seta_community_manager", "blue", "seta_admin@localtest.eu", HTTPStatus.FORBIDDEN),])
def test_create_community_invite(client: FlaskClient, authentication_url:str, user_id: str, community_id: str, email:str, expected: int):
    """
    Scenario: 'user1' is sending an invitation to a registered user email

    Given: 'user1' is authenticated users in SeTA
         AND data community 'blue' is registered 
         AND 'user1' is the manager of data community 'blue'
    When: 'user1' sends an invite
    Then: new invite is confirmed
    """

    
    response = login_user(auth_url=authentication_url, user_id=user_id)    
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]

    response = create_community_invite(client=client, access_token=access_token, community_id=community_id,
                message="Join my community", emails=[email])    
    assert response.status_code == expected 
    
    
@pytest.mark.parametrize("user_id, community_id", [("seta_community_manager", "blue")])
def test_accept_invite(client: FlaskClient, authentication_url:str, user_id: str, community_id: str):
    """
        'user2' accepts the invitation to 'blue' community
    """
    
    #this is used just to get the invite id, the invitation link will be genrated in the invite message
    response = login_user(auth_url=authentication_url, user_id="seta_admin")    
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]
    
    response = get_community_pending_invites(client=client, access_token=access_token, community_id=community_id)
    assert response.status_code == HTTPStatus.OK
    assert len(response.json) > 0
    assert "invite_id" in response.json[0]
    invite_id = response.json[0]["invite_id"]
    
    response = login_user(auth_url=authentication_url, user_id=user_id)    
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]
    
    response = get_invite(client=client,access_token=access_token,invite_id=invite_id)
    assert response.status_code == HTTPStatus.OK
    
    response = update_invite(client=client, access_token=access_token, invite_id=invite_id, status=InviteStatusConstants.Accepted)
    assert response.status_code == HTTPStatus.OK
    
    #check membership
    response = get_membership(client=client,access_token=access_token, community_id=community_id, user_id=user_id)
    assert response.status_code == HTTPStatus.OK
    
'''===========================================================''' 

