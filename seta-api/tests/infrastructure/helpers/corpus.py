from .util import auth_headers
from flask.testing import FlaskClient

def add_document(client: FlaskClient, access_token:str):
    url = f"/seta-api/api/v1/corpus"

    data = {"source": "cordis", "mime_type": "URL", "language": "en", "id": "cordis:article:1", "id_alias": "CORDIS:article:1", "title": "Evaluation of policy options to deal with the greenhouse effect", "abstract": "Invitation to tender for a study contract concerning the development of a framework for the evaluation of policy options to deal with the greenhouse effect as well as access strategies in this field.", "text": "\n\nInvitation to tender for a study contract concerning the development of a framework for the evaluation of policy options to deal with the greenhouse effect as well as access strategies in this field.Further information from:\nDr. B. Delogu\nCommission of the European Communities, DG XI/4 (Guim 3/31)\n200 rue de la Loi\nB-1049 Brussels\n\n", "date": "1990-02-07", "collection": "news;News", "link_origin": "https://cordis.europa.eu/article/rcn/1", "other": {"crc": "b724e9f86a0cfccbcdaf9a4b70b7988ffac668140d4cdedc5f5b5654da9d7e39"}}
    return client.put(url, json=data, content_type="application/json", headers=auth_headers(access_token)) 

def get_document(client: FlaskClient, access_token:str, document_id: str):
    url = f"/seta-api/api/v1/corpus/{document_id}"
    
    return client.get(url, content_type="application/json", headers=auth_headers(access_token))

def delete_document(client: FlaskClient, access_token:str, document_id: str):
    url = f"/seta-api/api/v1/corpus/{document_id}"

    return client.delete(url, headers=auth_headers(access_token))