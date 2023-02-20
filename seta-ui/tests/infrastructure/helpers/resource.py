from .util import auth_headers
from flask.testing import FlaskClient

def get_resource(client: FlaskClient, access_token:str, resource_id: str):
    url = f"/api/communities/v1/resources/{resource_id}"

    return client.get(url, content_type='application/json', headers=auth_headers(access_token))

def create_resource(client: FlaskClient, access_token:str, community_id: str, resource_id: str, title: str, abstract: str):
    url = f"/api/communities/v1/resources/community/{community_id}"

    data=f"resource_id={resource_id}&title={title}&abstract={abstract}" 
    return client.post(url, data=data, content_type="application/x-www-form-urlencoded", headers=auth_headers(access_token))

def update_resource(client: FlaskClient, access_token:str, resource_id: str, title: str, abstract: str, status: str):
    url = f"/api/communities/v1/resources/{resource_id}"

    data=f"title={title}&abstract={abstract}&status={status}" 
    return client.put(url, data=data, content_type="application/x-www-form-urlencoded", headers=auth_headers(access_token))

def delete_resource(client: FlaskClient, access_token:str, resource_id: str):
    url = f"/api/communities/v1/resources/{resource_id}"

    return client.delete(url, headers=auth_headers(access_token))