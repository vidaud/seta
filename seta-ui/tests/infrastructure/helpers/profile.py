from .util import auth_headers
from flask.testing import FlaskClient

API_V1 = "/seta-ui/api/v1/me"

#=========== user info  =================#

def get_account_info(client: FlaskClient, access_token:str):
    url = f"{API_V1}/"

    return client.get(url, content_type='application/json', headers=auth_headers(access_token))

def get_user_info(client: FlaskClient, access_token:str):
    url = f"{API_V1}/user-info"

    return client.get(url, content_type='application/json', headers=auth_headers(access_token))


#========= RSA Keys ======================#

def get_rsa_key(client: FlaskClient, access_token:str):
    url = f"{API_V1}/rsa-keys"

    return client.get(url, content_type='application/json', headers=auth_headers(access_token))

def create_rsa_key(client: FlaskClient, access_token:str):
    url = f"{API_V1}/rsa-keys"

    return client.post(url, content_type="application/x-www-form-urlencoded", headers=auth_headers(access_token))

def delete_rsa_key(client: FlaskClient, access_token:str):
    url = f"{API_V1}/rsa-keys"

    return client.delete(url, content_type="application/x-www-form-urlencoded", headers=auth_headers(access_token))

#========== Applications =================#

def create_app(client: FlaskClient, access_token:str, name: str, description: str, copy_public_key: bool = False, copy_resource_scopes: bool = True):
    url = f"{API_V1}/apps"

    data=f"name={name}&description={description}&copy_public_key={str(copy_public_key)}&copy_resource_scopes={str(copy_resource_scopes)}"
    return client.post(url, data=data, content_type="application/x-www-form-urlencoded", headers=auth_headers(access_token))

def get_user_apps(client: FlaskClient, access_token:str):
    url = f"{API_V1}/apps"

    return client.get(url, content_type='application/json', headers=auth_headers(access_token))

def get_app(client: FlaskClient, access_token:str, name: str):
    url = f"{API_V1}/apps/{name}"

    return client.get(url, content_type='application/json', headers=auth_headers(access_token))

def update_app(client: FlaskClient, access_token:str, name: str, new_name: str, description: str):
    url = f"{API_V1}/apps/{name}"

    data=f"new_name={new_name}&description={description}"
    return client.put(url, data=data, content_type="application/x-www-form-urlencoded", headers=auth_headers(access_token))