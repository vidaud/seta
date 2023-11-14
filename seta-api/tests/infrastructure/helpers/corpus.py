from .util import auth_headers
from flask.testing import FlaskClient
import time


def add_document(client: FlaskClient, access_token: str, data):
    url = f"/seta-api/api/v1/corpus/document"
    resp = client.post(url, json=data, content_type="application/json", headers=auth_headers(access_token))
    print("Wait for 1 second after put a document", flush=True)
    time.sleep(1)
    return resp


def get_document(client: FlaskClient, access_token: str, document_id: str):
    url = f"/seta-api/api/v1/corpus/document/id"
    data = {"document_id": document_id}
    return client.post(url, json=data, content_type="application/json", headers=auth_headers(access_token))


def delete_document(client: FlaskClient, access_token: str, document_id: str):
    url = f"/seta-api/api/v1/corpus/document/id"
    data = {"document_id": document_id}
    resp = client.delete(url, json=data, content_type="application/json", headers=auth_headers(access_token))
    print("Wait for 1 second after put a document", flush=True)
    time.sleep(1)
    return resp


def post_by_json(client: FlaskClient, access_token: str, json_param):
    url = f"/seta-api/api/v1/corpus"

    return client.post(url, json=json_param, content_type="application/json", headers=auth_headers(access_token))
