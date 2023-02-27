from .util import auth_headers
from flask.testing import FlaskClient

def get_user_permissions(client: FlaskClient, access_token:str, community_id: str, user_id: str):
    url = f"/api/communities/v1/permissions/community/{community_id}/user/{user_id}"

    return client.get(url, headers=auth_headers(access_token))

def replace_user_permissions(client: FlaskClient, access_token:str, community_id: str, user_id: str, scopes:list[str]):
    url = f"/api/communities/v1/permissions/community/{community_id}/user/{user_id}"

    data =""
    for scope in scopes:
        if data == "":
            data += f"scope={scope}"
        else:
            data += f"&scope={scope}"

    return client.post(url, data=data, content_type="application/x-www-form-urlencoded", headers=auth_headers(access_token))