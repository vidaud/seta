from .util import auth_headers
from flask.testing import FlaskClient

API_V1 = "/api/v1"

def create_community_change_request(client: FlaskClient, access_token:str, community_id: str, field_name: str, new_value: str, old_value: str):
    url = f"{API_V1}/communities/{community_id}/change-requests"

    data=f"field_name={field_name}&new_value={new_value}&old_value={old_value}" 
    return client.post(url, data=data, content_type="application/x-www-form-urlencoded", headers=auth_headers(access_token))

def get_community_pending_change_requests(client: FlaskClient, access_token:str):
    url = f"{API_V1}/communities/change-requests/pending"

    return client.get(url, content_type='application/json', headers=auth_headers(access_token)) 

def get_community_change_request(client: FlaskClient, access_token:str, community_id: str, request_id: str):
    url = f"{API_V1}/communities/{community_id}/change-requests/{request_id}"

    return client.get(url, content_type='application/json', headers=auth_headers(access_token))     

def update_community_change_request(client: FlaskClient, access_token:str, community_id: str, request_id: str, status: str):
    url = f"{API_V1}/communities/{community_id}/change-requests/{request_id}"

    data=f"status={status}" 
    return client.put(url, data=data, content_type="application/x-www-form-urlencoded", headers=auth_headers(access_token))    