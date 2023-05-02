import pytest
from flask.testing import FlaskClient
from http import HTTPStatus

from tests.infrastructure.helpers.authentication import (login_user)
from tests.infrastructure.helpers.corpus import (get_document, delete_document, get_by_term, post_by_json,
                                                 post_by_term, add_document, get_with_aggregation)


@pytest.mark.parametrize("user_id, term", [("seta_admin", "test_corpus_simple_search")])
def test_corpus_simple_search(client: FlaskClient, user_id: str, term: str):
    """Run simple search for GET & POST corpus methods"""

    response = login_user(auth_url=client.application.config["JWT_TOKEN_AUTH_URL"], user_id=user_id)
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]

    data = {"source": "cordis",
            "id": "cordis:article:1",
            "title": "test_corpus_simple_search"}

    response = add_document(client=client, access_token=access_token, data=data)
    assert response.status_code == HTTPStatus.OK
    assert "document_id" in response.json
    doc_id = response.json["document_id"]

    response = get_by_term(client=client, access_token=access_token, term=term)
    assert response.status_code == HTTPStatus.OK
    assert "total_docs" in response.json
    assert response.json["total_docs"] == 1
    assert response.json["documents"][0]["_id"] == doc_id

    response = post_by_term(client=client, access_token=access_token, term=term)
    assert response.status_code == HTTPStatus.OK
    assert "total_docs" in response.json
    assert response.json["total_docs"] == 1
    assert response.json["documents"][0]["_id"] == doc_id


@pytest.mark.parametrize("user_id", ["seta_admin"])
def test_corpus_doc(client: FlaskClient, user_id: str):
    """
        Add a new document, get its contents and delete
    """
    response = login_user(auth_url=client.application.config["JWT_TOKEN_AUTH_URL"], user_id=user_id)
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]

    data = {"source": "cordis",
            "id": "cordis:article:1",
            "title": "Evaluation of policy options to deal with the greenhouse effect"}

    response = add_document(client=client, access_token=access_token, data=data)
    assert response.status_code == HTTPStatus.OK
    assert "document_id" in response.json  
    doc_id = response.json["document_id"]

    response = get_document(client=client, access_token=access_token, document_id=doc_id)
    assert response.status_code == HTTPStatus.OK
    assert "source" in response.json
    assert response.json["source"] == "cordis"
    assert "id" in response.json
    assert response.json["id"] == "cordis:article:1"
    assert "title" in response.json
    assert response.json["title"] == "Evaluation of policy options to deal with the greenhouse effect"

    response = delete_document(client=client, access_token=access_token, document_id=doc_id)
    assert response.status_code == HTTPStatus.OK

    response = get_document(client=client, access_token=access_token, document_id=doc_id)
    assert response.status_code == HTTPStatus.NOT_FOUND


@pytest.mark.parametrize("user_id, aggs", [("seta_admin", "taxonomy:euro_sci_voc")])
def test_corpus_taxonomy_aggregation(client: FlaskClient, user_id: str, aggs: str):
    """Run simple search for GET & POST corpus methods"""

    response = login_user(auth_url=client.application.config["JWT_TOKEN_AUTH_URL"], user_id=user_id)
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]

    data = {"source": "cordis",
            "id": "cordis:article:1",
            "title": "test_corpus_taxonomy_aggregation",
            "taxonomy": [
                {
                    "code": "/29",
                    "label": "social sciences",
                    "longLabel": "/social sciences",
                    "validated": "true",
                    "classifier": "cordis",
                    "version": "1",
                    "name": "euro_sci_voc",
                    "name_in_path": "social_sciences"
                },
                {
                    "code": "/29/105",
                    "label": "educational sciences",
                    "longLabel": "/social sciences/educational sciences",
                    "validated": "true",
                    "classifier": "cordis",
                    "version": "1",
                    "name": "euro_sci_voc",
                    "name_in_path": "educational_sciences"
                },
                {
                    "code": "/29/105/573",
                    "label": "didactics",
                    "longLabel": "/social sciences/educational sciences/didactics",
                    "validated": "true",
                    "classifier": "cordis",
                    "version": "1",
                    "name": "euro_sci_voc",
                    "name_in_path": "didactics"
                },
                {
                    "code": "/29/105/571",
                    "label": "pedagogy",
                    "longLabel": "/social sciences/educational sciences/pedagogy",
                    "validated": "true",
                    "classifier": "cordis",
                    "version": "1",
                    "name": "euro_sci_voc",
                    "name_in_path": "pedagogy"
                }
            ],
            "taxonomy_path": ["euro_sci_voc:social_sciences:educational_sciences:didactics",
                              "euro_sci_voc:social_sciences:educational_sciences:pedagogy"]
            }

    response = add_document(client=client, access_token=access_token, data=data)
    assert response.status_code == HTTPStatus.OK
    response = add_document(client=client, access_token=access_token, data=data)
    assert response.status_code == HTTPStatus.OK

    response = get_with_aggregation(client=client, access_token=access_token, aggs=aggs)
    assert response.status_code == HTTPStatus.OK
    assert "aggregations" in response.json
    assert "taxonomy" in response.json["aggregations"]
    assert len(response.json["aggregations"]["taxonomy"]) > 0
    assert "name" in response.json["aggregations"]["taxonomy"][0]
    assert response.json["aggregations"]["taxonomy"][0]["name"] == "euro_sci_voc"


@pytest.mark.parametrize("user_id", ["seta_admin"])
def test_corpus_taxonomy_search(client: FlaskClient, user_id: str):
    """Run simple search for GET & POST corpus methods"""

    response = login_user(auth_url=client.application.config["JWT_TOKEN_AUTH_URL"], user_id=user_id)
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]

    data1 = {"source": "cordis",
            "id": "cordis:article:1",
            "title": "test_corpus_taxonomy_search",
            "taxonomy": [
                {
                    "code": "/29",
                    "label": "social sciences",
                    "longLabel": "/social sciences",
                    "validated": "true",
                    "classifier": "cordis",
                    "version": "1",
                    "name": "euro_sci_voc",
                    "name_in_path": "social_sciences"
                },
                {
                    "code": "/29/105",
                    "label": "educational sciences",
                    "longLabel": "/social sciences/educational sciences",
                    "validated": "true",
                    "classifier": "cordis",
                    "version": "1",
                    "name": "euro_sci_voc",
                    "name_in_path": "educational_sciences"
                },
                {
                    "code": "/29/105/571",
                    "label": "pedagogy",
                    "longLabel": "/social sciences/educational sciences/pedagogy",
                    "validated": "true",
                    "classifier": "cordis",
                    "version": "1",
                    "name": "euro_sci_voc",
                    "name_in_path": "pedagogy"
                }
            ],
            "taxonomy_path": ["euro_sci_voc:social_sciences:educational_sciences:pedagogy"]
            }

    data2 = {"source": "cordis",
            "id": "cordis:article:2",
            "title": "test_corpus_taxonomy_search",
            "taxonomy": [
                {
                    "code": "/29",
                    "label": "social sciences",
                    "longLabel": "/social sciences",
                    "validated": "true",
                    "classifier": "cordis",
                    "version": "1",
                    "name": "euro_sci_voc",
                    "name_in_path": "social_sciences"
                },
                {
                    "code": "/29/105",
                    "label": "educational sciences",
                    "longLabel": "/social sciences/educational sciences",
                    "validated": "true",
                    "classifier": "cordis",
                    "version": "1",
                    "name": "euro_sci_voc",
                    "name_in_path": "educational_sciences"
                },
                {
                    "code": "/29/105/573",
                    "label": "didactics",
                    "longLabel": "/social sciences/educational sciences/didactics",
                    "validated": "true",
                    "classifier": "cordis",
                    "version": "1",
                    "name": "euro_sci_voc",
                    "name_in_path": "didactics"
                }
            ],
            "taxonomy_path": ["euro_sci_voc:social_sciences:educational_sciences:didactics"]
            }

    response = add_document(client=client, access_token=access_token, data=data1)
    assert response.status_code == HTTPStatus.OK
    assert "document_id" in response.json
    doc_id_1 = response.json["document_id"]
    response = add_document(client=client, access_token=access_token, data=data2)
    assert response.status_code == HTTPStatus.OK
    assert "document_id" in response.json
    doc_id_2 = response.json["document_id"]

    json_p = {"term": "test_corpus_taxonomy_search", "taxonomy": [{"name": "euro_sci_voc", "label": "pedagogy"}]}
    response = post_by_json(client=client, access_token=access_token, json_param=json_p)
    assert response.status_code == HTTPStatus.OK
    assert "documents" in response.json
    assert len(response.json["documents"]) == 1
    assert doc_id_1 in response.json["documents"][0]["_id"]

    json_p = {"term": "test_corpus_taxonomy_search", "taxonomy": [{"name": "euro_sci_voc", "label": "didactics"}]}
    response = post_by_json(client=client, access_token=access_token, json_param=json_p)
    assert response.status_code == HTTPStatus.OK
    assert "documents" in response.json
    assert len(response.json["documents"]) == 1
    assert doc_id_2 in response.json["documents"][0]["_id"]
