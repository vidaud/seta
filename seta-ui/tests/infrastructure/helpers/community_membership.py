from .util import auth_headers
from flask.testing import FlaskClient

def get_membership_requests(client: FlaskClient, access_token:str, community_id: str):
    url = f"/api/communities/v1/communities/{community_id}/requests"

    return client.get(url, content_type='application/json', headers=auth_headers(access_token))

def create_membership_request(client: FlaskClient, access_token:str, community_id: str, message: str):
    url = f"/api/communities/v1/communities/{community_id}/requests"

    data=f"message={message}" 
    return client.post(url, data=data, content_type="application/x-www-form-urlencoded", headers=auth_headers(access_token))

def update_membership_request(client: FlaskClient, access_token:str, community_id: str, user_id: str, status: str):
    url = f"/api/communities/v1/communities/{community_id}/requests/{user_id}"

    data=f"status={status}" 
    return client.put(url, data=data, content_type="application/x-www-form-urlencoded", headers=auth_headers(access_token))
