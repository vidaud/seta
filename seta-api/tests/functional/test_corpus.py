import pytest
from flask.testing import FlaskClient
from http import HTTPStatus

from tests.infrastructure.helpers.authentication import login_user
from tests.infrastructure.helpers.corpus import (
    get_document,
    delete_document,
    get_by_term,
    post_by_json,
    post_by_term,
    add_document,
    get_with_aggregation,
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
    }

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
def test_corpus_doc(client: FlaskClient, user_key_pairs: dict, user_id: str):
    """
    Add a new document, get its contents and delete
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
    assert "document_id" in response.json
    doc_id = response.json["document_id"]

    response = get_document(
        client=client, access_token=access_token, document_id=doc_id
    )
    assert response.status_code == HTTPStatus.OK
    assert "source" in response.json
    assert response.json["source"] == "cordis"
    assert "id" in response.json
    assert response.json["id"] == "cordis:article:1"
    assert "title" in response.json
    assert (
        response.json["title"]
        == "Evaluation of policy options to deal with the greenhouse effect"
    )

    response = delete_document(
        client=client, access_token=access_token, document_id=doc_id
    )
    assert response.status_code == HTTPStatus.OK

    response = get_document(
        client=client, access_token=access_token, document_id=doc_id
    )
    assert response.status_code == HTTPStatus.NOT_FOUND


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
        "taxonomy": [
            {
                "classifier": "cordis",
                "code": "00",
                "label": "euro_sci_voc",
                "longLabel": "euro_sci_voc",
                "validated": "true",
                "version": "1",
                "name_in_path": "euro_sci_voc",
                "subcategories": [
                    {
                        "classifier": "cordis",
                        "code": "/29",
                        "label": "social sciences",
                        "longLabel": "/social sciences",
                        "validated": "true",
                        "name_in_path": "social_sciences",
                        "version": "1",
                        "subcategories": [
                            {
                                "classifier": "cordis",
                                "code": "/29/105",
                                "label": "educational sciences",
                                "longLabel": "/social sciences/educational sciences",
                                "validated": "true",
                                "name_in_path": "educational_sciences",
                                "version": "1",
                                "subcategories": [
                                    {
                                        "classifier": "cordis",
                                        "code": "/29/105/573",
                                        "label": "didactics",
                                        "longLabel": "/social sciences/educational sciences/didactics",
                                        "validated": "true",
                                        "name_in_path": "didactics",
                                        "version": "1",
                                        "subcategories": [],
                                    },
                                    {
                                        "classifier": "cordis",
                                        "code": "/29/105/571",
                                        "label": "pedagogy",
                                        "longLabel": "/social sciences/educational sciences/pedagogy",
                                        "validated": "true",
                                        "name_in_path": "pedagogy",
                                        "version": "1",
                                        "subcategories": [],
                                    },
                                ],
                            }
                        ],
                    }
                ],
            }
        ],
    }

    data2 = {
        "source": "cordis",
        "id": "cordis:article:1",
        "title": "test_corpus_taxonomy_aggregation",
        "taxonomy": [
            {
                "classifier": "xxx",
                "code": "00",
                "label": "taxonomy1",
                "longLabel": "taxonomy1",
                "validated": "true",
                "version": "1",
                "name_in_path": "taxonomy1",
                "subcategories": [
                    {
                        "classifier": "cordis",
                        "code": "/29",
                        "label": "social sciences",
                        "longLabel": "/social sciences",
                        "validated": "true",
                        "name_in_path": "social_sciences",
                        "version": "1",
                        "subcategories": [
                            {
                                "classifier": "cordis",
                                "code": "/29/105",
                                "label": "educational sciences",
                                "longLabel": "/social sciences/educational sciences",
                                "validated": "true",
                                "name_in_path": "educational_sciences",
                                "version": "1",
                                "subcategories": [
                                    {
                                        "classifier": "cordis",
                                        "code": "/29/105/573",
                                        "label": "didactics",
                                        "longLabel": "/social sciences/educational sciences/didactics",
                                        "validated": "true",
                                        "name_in_path": "didactics",
                                        "version": "1",
                                        "subcategories": [],
                                    },
                                    {
                                        "classifier": "cordis",
                                        "code": "/29/105/571",
                                        "label": "pedagogy",
                                        "longLabel": "/social sciences/educational sciences/pedagogy",
                                        "validated": "true",
                                        "name_in_path": "pedagogy",
                                        "version": "1",
                                        "subcategories": [],
                                    },
                                ],
                            }
                        ],
                    }
                ],
            }
        ],
    }

    response = add_document(client=client, access_token=access_token, data=data1)
    assert response.status_code == HTTPStatus.OK
    response = add_document(client=client, access_token=access_token, data=data2)
    assert response.status_code == HTTPStatus.OK

    response = get_with_aggregation(client=client, access_token=access_token, aggs=aggs)
    assert response.status_code == HTTPStatus.OK
    assert "aggregations" in response.json
    assert "taxonomies" in response.json["aggregations"]
    assert len(response.json["aggregations"]["taxonomies"]) == 2
    assert "name_in_path" in response.json["aggregations"]["taxonomies"][0]
    assert (
        response.json["aggregations"]["taxonomies"][0]["name_in_path"] == "euro_sci_voc"
    )
    assert response.json["aggregations"]["taxonomies"][1]["name_in_path"] == "taxonomy1"
    assert response.json["aggregations"]["taxonomies"] == [
        {
            "classifier": "cordis",
            "code": "00",
            "doc_count": 1,
            "label": "euro_sci_voc",
            "longLabel": "euro_sci_voc",
            "name_in_path": "euro_sci_voc",
            "subcategories": [
                {
                    "classifier": "cordis",
                    "code": "/29",
                    "doc_count": 1,
                    "label": "social sciences",
                    "longLabel": "/social sciences",
                    "name_in_path": "social_sciences",
                    "subcategories": [
                        {
                            "classifier": "cordis",
                            "code": "/29/105",
                            "doc_count": 1,
                            "label": "educational sciences",
                            "longLabel": "/social sciences/educational sciences",
                            "name_in_path": "educational_sciences",
                            "subcategories": [
                                {
                                    "classifier": "cordis",
                                    "code": "/29/105/573",
                                    "doc_count": 1,
                                    "label": "didactics",
                                    "longLabel": "/social sciences/educational sciences/didactics",
                                    "name_in_path": "didactics",
                                    "subcategories": [],
                                    "validated": "true",
                                    "version": "1",
                                },
                                {
                                    "classifier": "cordis",
                                    "code": "/29/105/571",
                                    "doc_count": 1,
                                    "label": "pedagogy",
                                    "longLabel": "/social sciences/educational sciences/pedagogy",
                                    "name_in_path": "pedagogy",
                                    "subcategories": [],
                                    "validated": "true",
                                    "version": "1",
                                },
                            ],
                            "validated": "true",
                            "version": "1",
                        }
                    ],
                    "validated": "true",
                    "version": "1",
                }
            ],
            "validated": "true",
            "version": "1",
        },
        {
            "classifier": "xxx",
            "code": "00",
            "doc_count": 1,
            "label": "taxonomy1",
            "longLabel": "taxonomy1",
            "name_in_path": "taxonomy1",
            "subcategories": [
                {
                    "classifier": "cordis",
                    "code": "/29",
                    "doc_count": 1,
                    "label": "social sciences",
                    "longLabel": "/social sciences",
                    "name_in_path": "social_sciences",
                    "subcategories": [
                        {
                            "classifier": "cordis",
                            "code": "/29/105",
                            "doc_count": 1,
                            "label": "educational sciences",
                            "longLabel": "/social sciences/educational sciences",
                            "name_in_path": "educational_sciences",
                            "subcategories": [
                                {
                                    "classifier": "cordis",
                                    "code": "/29/105/573",
                                    "doc_count": 1,
                                    "label": "didactics",
                                    "longLabel": "/social sciences/educational sciences/didactics",
                                    "name_in_path": "didactics",
                                    "subcategories": [],
                                    "validated": "true",
                                    "version": "1",
                                },
                                {
                                    "classifier": "cordis",
                                    "code": "/29/105/571",
                                    "doc_count": 1,
                                    "label": "pedagogy",
                                    "longLabel": "/social sciences/educational sciences/pedagogy",
                                    "name_in_path": "pedagogy",
                                    "subcategories": [],
                                    "validated": "true",
                                    "version": "1",
                                },
                            ],
                            "validated": "true",
                            "version": "1",
                        }
                    ],
                    "validated": "true",
                    "version": "1",
                }
            ],
            "validated": "true",
            "version": "1",
        },
    ]


@pytest.mark.parametrize("user_id, aggs", [("seta_admin", "taxonomy:euro")])
def test_corpus_taxonomy_aggregation_with_one_taxonomy(
    client: FlaskClient, user_key_pairs: dict, user_id: str, aggs: str
):
    """Run search with aggregation on taxonomy field for GET corpus methods"""

    authentication_url = client.application.config["JWT_TOKEN_AUTH_URL"]
    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    data = {
        "source": "cordis",
        "id": "cordis:article:1",
        "title": "test_corpus_taxonomy_aggregation",
        "taxonomy": [
            {
                "classifier": "cordis",
                "code": "00",
                "label": "euro",
                "longLabel": "euro",
                "validated": "true",
                "version": "1",
                "name_in_path": "euro",
                "subcategories": [
                    {
                        "classifier": "cordis",
                        "code": "/29",
                        "label": "social sciences",
                        "longLabel": "/social sciences",
                        "validated": "true",
                        "name_in_path": "social_sciences",
                        "version": "1",
                        "subcategories": [
                            {
                                "classifier": "cordis",
                                "code": "/29/105",
                                "label": "educational sciences",
                                "longLabel": "/social sciences/educational sciences",
                                "validated": "true",
                                "name_in_path": "educational_sciences",
                                "version": "1",
                                "subcategories": [
                                    {
                                        "classifier": "cordis",
                                        "code": "/29/105/573",
                                        "label": "didactics",
                                        "longLabel": "/social sciences/educational sciences/didactics",
                                        "validated": "true",
                                        "name_in_path": "didactics",
                                        "version": "1",
                                        "subcategories": [],
                                    },
                                    {
                                        "classifier": "cordis",
                                        "code": "/29/105/571",
                                        "label": "pedagogy",
                                        "longLabel": "/social sciences/educational sciences/pedagogy",
                                        "validated": "true",
                                        "name_in_path": "pedagogy",
                                        "version": "1",
                                        "subcategories": [],
                                    },
                                ],
                            }
                        ],
                    }
                ],
            }
        ],
    }

    # add the same document twice
    response = add_document(client=client, access_token=access_token, data=data)
    assert response.status_code == HTTPStatus.OK
    response = add_document(client=client, access_token=access_token, data=data)
    assert response.status_code == HTTPStatus.OK

    response = get_with_aggregation(client=client, access_token=access_token, aggs=aggs)
    assert response.status_code == HTTPStatus.OK
    assert "aggregations" in response.json
    assert "taxonomy" in response.json["aggregations"]
    assert len(response.json["aggregations"]["taxonomy"]) > 0
    assert "name_in_path" in response.json["aggregations"]["taxonomy"][0]
    assert response.json["aggregations"]["taxonomy"][0]["name_in_path"] == "euro"
    assert response.json["aggregations"]["taxonomy"] == [
        {
            "classifier": "cordis",
            "code": "00",
            "doc_count": 2,
            "label": "euro",
            "longLabel": "euro",
            "name_in_path": "euro",
            "validated": "true",
            "version": "1",
            "subcategories": [
                {
                    "classifier": "cordis",
                    "code": "/29",
                    "doc_count": 2,
                    "label": "social sciences",
                    "longLabel": "/social sciences",
                    "name_in_path": "social_sciences",
                    "validated": "true",
                    "version": "1",
                    "subcategories": [
                        {
                            "classifier": "cordis",
                            "code": "/29/105",
                            "doc_count": 2,
                            "label": "educational sciences",
                            "longLabel": "/social sciences/educational sciences",
                            "name_in_path": "educational_sciences",
                            "validated": "true",
                            "version": "1",
                            "subcategories": [
                                {
                                    "classifier": "cordis",
                                    "code": "/29/105/573",
                                    "doc_count": 2,
                                    "label": "didactics",
                                    "longLabel": "/social sciences/educational sciences/didactics",
                                    "name_in_path": "didactics",
                                    "validated": "true",
                                    "version": "1",
                                    "subcategories": [],
                                },
                                {
                                    "classifier": "cordis",
                                    "code": "/29/105/571",
                                    "doc_count": 2,
                                    "label": "pedagogy",
                                    "longLabel": "/social sciences/educational sciences/pedagogy",
                                    "name_in_path": "pedagogy",
                                    "validated": "true",
                                    "version": "1",
                                    "subcategories": [],
                                },
                            ],
                        }
                    ],
                }
            ],
        }
    ]


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
        "taxonomy": [
            {
                "classifier": "cordis",
                "code": "00",
                "label": "euro_sci_voc",
                "longLabel": "euro_sci_voc",
                "validated": "true",
                "version": "1",
                "name_in_path": "euro_sci_voc",
                "subcategories": [
                    {
                        "classifier": "cordis",
                        "code": "/29",
                        "label": "social sciences",
                        "longLabel": "/social sciences",
                        "validated": "true",
                        "name_in_path": "social_sciences",
                        "version": "1",
                        "subcategories": [
                            {
                                "classifier": "cordis",
                                "code": "/29/105",
                                "label": "educational sciences",
                                "longLabel": "/social sciences/educational sciences",
                                "validated": "true",
                                "name_in_path": "educational_sciences",
                                "version": "1",
                                "subcategories": [
                                    {
                                        "classifier": "cordis",
                                        "code": "/29/105/571",
                                        "label": "pedagogy",
                                        "longLabel": "/social sciences/educational sciences/pedagogy",
                                        "validated": "true",
                                        "name_in_path": "pedagogy",
                                        "version": "1",
                                        "subcategories": [],
                                    }
                                ],
                            }
                        ],
                    }
                ],
            }
        ],
    }

    data2 = {
        "source": "cordis",
        "id": "cordis:article:2",
        "title": "test_corpus_taxonomy_search",
        "taxonomy": [
            {
                "classifier": "cordis",
                "code": "00",
                "label": "euro_sci_voc",
                "longLabel": "euro_sci_voc",
                "validated": "true",
                "version": "1",
                "name_in_path": "euro_sci_voc",
                "subcategories": [
                    {
                        "classifier": "cordis",
                        "code": "/29",
                        "label": "social sciences",
                        "longLabel": "/social sciences",
                        "validated": "true",
                        "name_in_path": "social_sciences",
                        "version": "1",
                        "subcategories": [
                            {
                                "classifier": "cordis",
                                "code": "/29/105",
                                "label": "educational sciences",
                                "longLabel": "/social sciences/educational sciences",
                                "validated": "true",
                                "name_in_path": "educational_sciences",
                                "version": "1",
                                "subcategories": [
                                    {
                                        "classifier": "cordis",
                                        "code": "/29/105/573",
                                        "label": "didactics",
                                        "longLabel": "/social sciences/educational sciences/didactics",
                                        "validated": "true",
                                        "name_in_path": "didactics",
                                        "version": "1",
                                        "subcategories": [],
                                    }
                                ],
                            }
                        ],
                    }
                ],
            }
        ],
    }

    response = add_document(client=client, access_token=access_token, data=data1)
    assert response.status_code == HTTPStatus.OK
    assert "document_id" in response.json
    doc_id_1 = response.json["document_id"]
    response = add_document(client=client, access_token=access_token, data=data2)
    assert response.status_code == HTTPStatus.OK
    assert "document_id" in response.json
    doc_id_2 = response.json["document_id"]

    json_p = {
        "term": "test_corpus_taxonomy_search",
        "taxonomy_path": ["euro_sci_voc:social_sciences:educational_sciences:pedagogy"],
    }
    response = post_by_json(client=client, access_token=access_token, json_param=json_p)
    assert response.status_code == HTTPStatus.OK
    assert "documents" in response.json
    assert len(response.json["documents"]) == 1
    assert doc_id_1 in response.json["documents"][0]["_id"]

    json_p = {
        "term": "test_corpus_taxonomy_search",
        "taxonomy_path": [
            "euro_sci_voc:social_sciences:educational_sciences:didactics"
        ],
    }
    response = post_by_json(client=client, access_token=access_token, json_param=json_p)
    assert response.status_code == HTTPStatus.OK
    assert "documents" in response.json
    assert len(response.json["documents"]) == 1
    assert doc_id_2 in response.json["documents"][0]["_id"]

    json_p = {
        "term": "test_corpus_taxonomy_search",
        "taxonomy_path": ["euro_sci_voc:social_sciences:educational_sciences"],
    }
    response = post_by_json(client=client, access_token=access_token, json_param=json_p)
    assert response.status_code == HTTPStatus.OK
    assert "documents" in response.json
    assert len(response.json["documents"]) == 2

    json_p = {
        "term": "test_corpus_taxonomy_search",
        "taxonomy_path": [
            "euro_sci_voc:social_sciences:educational_sciences:didactics",
            "euro_sci_voc:social_sciences:educational_sciences:pedagogy",
        ],
    }
    response = post_by_json(client=client, access_token=access_token, json_param=json_p)
    assert response.status_code == HTTPStatus.OK
    assert "documents" in response.json
    assert len(response.json["documents"]) == 2
