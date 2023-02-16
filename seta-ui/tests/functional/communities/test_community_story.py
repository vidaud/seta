import pytest
from flask.testing import FlaskClient
from http import HTTPStatus

from tests.infrastructure.helpers.authentication import (generate_signature, login_user)
from tests.infrastructure.helpers.community import (create_community, get_community)
from tests.infrastructure.helpers.util import get_private_key
from seta_flask_server.repository.models import CommunityModel
   
@pytest.mark.parametrize("user_id", ["seta_admin"])
def test_create_community(client: FlaskClient, user_id: str):
    """
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


    