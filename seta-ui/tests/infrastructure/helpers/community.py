from .util import auth_headers
from flask.testing import FlaskClient

API_V1 = "/api/v1"

def get_community(client: FlaskClient, access_token:str, id: str):
    url = f"{API_V1}/communities/{id}"

    return client.get(url, content_type='application/json', headers=auth_headers(access_token))

def create_community(client: FlaskClient, access_token:str, id: str, title: str, description: str, data_type: str):
    url = f"{API_V1}/communities/"

    data=f"community_id={id}&title={title}&description={description}&data_type={data_type}" 
    return client.post(url, data=data, content_type="application/x-www-form-urlencoded", headers=auth_headers(access_token))

def update_community(client: FlaskClient, access_token:str, id: str, title: str, description: str, data_type: str, status: str):
    url = f"{API_V1}/communities/{id}"

    data=f"title={title}&description={description}&data_type={data_type}&status={status}" 
    return client.put(url, data=data, content_type="application/x-www-form-urlencoded", headers=auth_headers(access_token))

def delete_community(client: FlaskClient, access_token:str, id: str):
    url = f"{API_V1}/communities/{id}"

    return client.delete(url, headers=auth_headers(access_token))    

