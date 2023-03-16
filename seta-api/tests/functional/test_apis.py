import pytest
from flask.testing import FlaskClient
from http import HTTPStatus

from tests.infrastructure.helpers.authentication import (login_user)
from tests.infrastructure.helpers.corpus import (add_document, get_document, delete_document)

@pytest.mark.parametrize("user_id", ["seta_admin"])
def test_corpus_doc(client: FlaskClient, user_id: str):
    """
        Add a new document, get its contents and delete
    """
    response = login_user(auth_url= client.application.config["JWT_TOKEN_AUTH_URL"], user_id=user_id)    
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]    
    
    response = add_document(client=client, access_token=access_token)   
    assert response.status_code == HTTPStatus.OK
    assert "document_id" in response.json  
    doc_id = response.json["document_id"]
    
    response = get_document(client=client, access_token=access_token, document_id=doc_id)
    assert response.status_code == HTTPStatus.OK
    #!check something in the document data  
    
    response = delete_document(client=client, access_token=access_token, document_id=doc_id)
    assert response.status_code == HTTPStatus.OK  
    
    response = get_document(client=client, access_token=access_token, document_id=doc_id)
    assert response.status_code == HTTPStatus.NOT_FOUND