from .util import auth_headers
from flask.testing import FlaskClient
import urllib.parse
import time


def add_document(client: FlaskClient, access_token: str, data):
    url = f"/seta-api/api/v1/corpus"

    resp = client.put(url, json=data, content_type="application/json", headers=auth_headers(access_token))
    print("Wait for 1 second after put a document", flush=True)
    time.sleep(1)
    return resp


def get_document(client: FlaskClient, access_token: str, document_id: str):
    url = f"/seta-api/api/v1/corpus/{document_id}"

    return client.get(url, content_type="application/json", headers=auth_headers(access_token))


def delete_document(client: FlaskClient, access_token: str, document_id: str):
    url = f"/seta-api/api/v1/corpus/{document_id}"

    return client.delete(url, headers=auth_headers(access_token))


def get_by_term(client: FlaskClient, access_token: str, term: str):
    url = f"/seta-api/api/v1/corpus?term={term}"

    return client.get(url, content_type="application/json", headers=auth_headers(access_token))


def get_with_aggregation(client: FlaskClient, access_token: str, aggs: str):
    url = f"/seta-api/api/v1/corpus?aggs={urllib.parse.quote(aggs)}"

    return client.get(url, content_type="application/json", headers=auth_headers(access_token))


def post_by_term(client: FlaskClient, access_token: str, term: str):
    url = f"/seta-api/api/v1/corpus"

    data = {"term": term}

    return client.post(url, json=data, content_type="application/json", headers=auth_headers(access_token))


def post_by_json(client: FlaskClient, access_token: str, json_param):
    url = f"/seta-api/api/v1/corpus"

    return client.post(url, json=json_param, content_type="application/json", headers=auth_headers(access_token))