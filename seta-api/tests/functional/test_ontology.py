import pytest
from flask.testing import FlaskClient
from http import HTTPStatus

from tests.infrastructure.helpers.util import auth_headers
from tests.infrastructure.helpers.authentication import login_user

from tests.infrastructure.helpers.util import get_access_token


def get_by_term(client: FlaskClient, access_token: str, term: str):
    url = f"/seta-api/api/v1/ontology?term={term}"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


def get_list_by_term(client: FlaskClient, access_token: str, term: str):
    url = f"/seta-api/api/v1/ontology-list?term={term}"

    return client.get(
        url, content_type="application/json", headers=auth_headers(access_token)
    )


@pytest.mark.parametrize("user_id", ["seta_admin"])
@pytest.mark.parametrize(
    "term, expect", [("a", HTTPStatus.OK), ("qqqqqqq", HTTPStatus.OK)]
)
def test_ontology_term(
    client: FlaskClient, user_key_pairs: dict, user_id: str, term: str, expect: str
):
    """
    Test graph that describes the ontology of the specified term
    """

    authentication_url = client.application.config["JWT_TOKEN_AUTH_URL"]
    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    response = get_by_term(client=client, access_token=access_token, term=term)
    assert response.status_code == expect
    # TODO: check response
    if response.status_code == HTTPStatus.OK:
        assert "links" in response.json


@pytest.mark.parametrize("user_id", ["seta_admin"])
@pytest.mark.parametrize(
    "term, expect", [("a", HTTPStatus.OK), ("qqqqqqq", HTTPStatus.OK)]
)
def test_ontology_list_term(
    client: FlaskClient, user_key_pairs: dict, user_id: str, term: str, expect: str
):
    """
    Test graph that describes the ontology of the specified term
    """

    authentication_url = client.application.config["JWT_TOKEN_AUTH_URL"]
    response = login_user(
        auth_url=authentication_url, user_key_pairs=user_key_pairs, user_id=user_id
    )
    access_token = get_access_token(response)

    response = get_by_term(client=client, access_token=access_token, term=term)
    assert response.status_code == expect
    # TODO: check response
    if response.status_code == HTTPStatus.OK:
        assert "nodes" in response.json
