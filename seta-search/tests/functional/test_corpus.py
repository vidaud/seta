from http import HTTPStatus
import pytest
from flask.testing import FlaskClient

from tests.infrastructure.helpers.authentication import login_user
from tests.infrastructure.helpers.corpus import (
    get_document,
    delete_document,
    post_by_json,
    add_document,
)

from tests.infrastructure.helpers.util import get_access_token


@pytest.mark.parametrize("user_id, term", [("seta_admin", "test_corpus_simple_search")])
def test_corpus_simple_search(
    client: FlaskClient, user_key_pairs: dict, user_id: str, term: str
):
    """Run simple search for GET & POST corpus methods"""

    authentication_url = client.application.config["JWT_TOKEN_AUTH_URL"]
    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    data = {
        "source": "cordis",
        "id": "cordis:article:1",
        "title": "test_corpus_simple_search",
        "date": "2023-01-01",
    }

    response = add_document(client=client, access_token=access_token, data=data)
    assert response.status_code == HTTPStatus.OK
    assert "_id" in response.json
    doc_id = response.json["_id"]

    json_p = {"term": term, "source": ["cordis"]}
    response = post_by_json(client=client, access_token=access_token, json_param=json_p)
    assert response.status_code == HTTPStatus.OK
    assert "total_docs" in response.json
    assert response.json["total_docs"] == 1
    assert response.json["documents"][0]["_id"] == doc_id


@pytest.mark.parametrize("user_id", ["seta_admin"])
def test_corpus_doc(client: FlaskClient, user_key_pairs: dict, user_id: str):
    """
    Add a new document, get its contents and delete it
    """
    authentication_url = client.application.config["JWT_TOKEN_AUTH_URL"]
    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    data = {
        "source": "cordis",
        "id": "cordis:article:1",
        "title": "Evaluation of policy options to deal with the greenhouse effect",
    }

    response = add_document(client=client, access_token=access_token, data=data)
    assert response.status_code == HTTPStatus.OK
    assert "_id" in response.json
    doc_id = response.json["_id"]

    response = get_document(
        client=client, access_token=access_token, document_id=doc_id
    )
    assert response.status_code == HTTPStatus.OK
    assert "chunk_list" in response.json
    assert "source" in response.json["chunk_list"][0]
    assert response.json["chunk_list"][0]["source"] == "cordis"
    assert "id" in response.json["chunk_list"][0]
    assert response.json["chunk_list"][0]["id"] == "cordis:article:1"
    assert "title" in response.json["chunk_list"][0]
    assert (
        response.json["chunk_list"][0]["title"]
        == "Evaluation of policy options to deal with the greenhouse effect"
    )

    response = delete_document(
        client=client, access_token=access_token, document_id=doc_id
    )
    assert response.status_code == HTTPStatus.OK

    response = get_document(
        client=client, access_token=access_token, document_id=doc_id
    )
    assert response.status_code == HTTPStatus.OK
    assert "chunk_list" in response.json
    assert len(response.json["chunk_list"]) == 0


@pytest.mark.parametrize("user_id, aggs", [("seta_admin", "taxonomies")])
def test_corpus_taxonomy_aggregation(
    client: FlaskClient, user_key_pairs: dict, user_id: str, aggs: str
):
    """Run search with aggregation on taxonomy field for GET corpus methods"""

    authentication_url = client.application.config["JWT_TOKEN_AUTH_URL"]
    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    data1 = {
        "source": "cordis",
        "id": "cordis:article:1",
        "title": "test_corpus_taxonomy_aggregation",
        "date": "2023-01-01",
        "taxonomy": ["eurovocTree:100163", "eurovocTree:883"],
    }

    data2 = {
        "source": "cordis",
        "id": "cordis:article:1",
        "title": "test_corpus_taxonomy_aggregation",
        "date": "2023-01-01",
        "taxonomy": ["eurovocTree:1", "eurovocTree:2"],
    }

    response = add_document(client=client, access_token=access_token, data=data1)
    assert response.status_code == HTTPStatus.OK
    response = add_document(client=client, access_token=access_token, data=data2)
    assert response.status_code == HTTPStatus.OK

    json_param = {"aggs": [aggs]}
    response = post_by_json(
        client=client, access_token=access_token, json_param=json_param
    )
    assert response.status_code == HTTPStatus.OK
    assert "aggregations" in response.json
    assert "taxonomies" in response.json["aggregations"]
    assert len(response.json["aggregations"]["taxonomies"]) > 1


@pytest.mark.parametrize("user_id", ["seta_admin"])
def test_corpus_taxonomy_search(
    client: FlaskClient, user_key_pairs: dict, user_id: str
):
    """Run taxonomy search for POST corpus methods"""

    authentication_url = client.application.config["JWT_TOKEN_AUTH_URL"]
    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    data1 = {
        "source": "cordis",
        "id": "cordis:article:1",
        "title": "test_corpus_taxonomy_search",
        "date": "2023-01-01",
        "taxonomy": ["eurovocTree:100163", "eurovocTree:883"],
    }

    data2 = {
        "source": "cordis",
        "id": "cordis:article:2",
        "date": "2023-01-01",
        "title": "test_corpus_taxonomy_search",
        "taxonomy": ["eurovocTree:1", "eurovocTree:2"],
    }

    response = add_document(client=client, access_token=access_token, data=data1)
    assert response.status_code == HTTPStatus.OK
    assert "_id" in response.json
    doc_id_1 = response.json["_id"]

    response = add_document(client=client, access_token=access_token, data=data2)
    assert response.status_code == HTTPStatus.OK
    assert "_id" in response.json
    doc_id_2 = response.json["_id"]

    json_p = {
        "term": "test_corpus_taxonomy_search",
        "taxonomy": ["eurovocTree:100163", "eurovocTree:883"],
    }
    response = post_by_json(client=client, access_token=access_token, json_param=json_p)
    assert response.status_code == HTTPStatus.OK
    assert "documents" in response.json
    assert len(response.json["documents"]) == 1
    assert doc_id_1 in response.json["documents"][0]["_id"]

    json_p = {
        "term": "test_corpus_taxonomy_search",
        "taxonomy": ["eurovocTree:11", "eurovocTree:22"],
    }
    response = post_by_json(client=client, access_token=access_token, json_param=json_p)
    assert response.status_code == HTTPStatus.OK
    assert "documents" in response.json
    assert len(response.json["documents"]) == 0

    json_p = {
        "term": "test_corpus_taxonomy_search",
        "taxonomy": ["eurovocTree:1", "eurovocTree:2"],
    }
    response = post_by_json(client=client, access_token=access_token, json_param=json_p)
    assert response.status_code == HTTPStatus.OK
    assert "documents" in response.json
    assert len(response.json["documents"]) == 1
    assert doc_id_2 in response.json["documents"][0]["_id"]
