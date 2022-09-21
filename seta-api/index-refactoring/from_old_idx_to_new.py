""""
once the process on seta-multi-embedding-000001 will finish,
copy all data from old format to new one index seta-public-000001
"""
from elasticsearch import Elasticsearch, helpers
import yaml
from utils.embeddings import Embeddings
import json
config = yaml.load(open("../config.yaml"), Loader=yaml.FullLoader)

TO_INDEX_NAME = "seta-public-000001"
es2 = Elasticsearch("https://localhost:9200", basic_auth=("elastic", "Bd88yLgN9e3R2ciVkEqI"),
                    ca_certs="C:\Projects\seta-api\index-refactoring\http_ca.crt", verify_certs=False)
#use export all with elasticsearch library 7.0.4
file1 = open('export-1000.jsonl', 'r')
Lines = file1.readlines()

def get_empty_doc():
    my_doc = {"id": None,
              "id_alias": None,
              "source": None,
              "title": None,
              "abstract": None,
              "collection": None,
              "reference": None,
              "author": None,
              "date": None,
              "link_origin": None,
              "link_alias": None,
              "link_related": None,
              "link_reference": None,
              "mime_type": None,
              "in_force": None,
              "language": None,
              "eurovoc_concept": {"label": None, "validated": None, "classifier": None, "version": None},
              "eurovoc_domain": {"label": None, "validated": None, "classifier": None, "version": None},
              "eurovoc_mth": {"label": None, "validated": None, "classifier": None, "version": None},
              "ec_priority": {"label": None, "validated": None, "classifier": None, "version": None},
              "sdg_domain": {"label": None, "validated": None, "classifier": None, "version": None},
              "sdg_subdomain": {"label": None, "validated": None, "classifier": None, "version": None},
              "euro_sci_voc": {"label": None, "validated": None, "classifier": None, "version": None},
              "keywords": None,
              "other": None
              }
    return my_doc


def is_field_in_doc(source, field):
    if field in source:
        return source[field]
    else:
        return None


n = 0
for doc in Lines:
    doc = json.loads(doc)
    my_doc = get_empty_doc()

    my_doc["id"] = is_field_in_doc(doc["_source"], "id")
    my_doc["id_alias"] = is_field_in_doc(doc["_source"], "longid")
    my_doc["source"] = is_field_in_doc(doc["_source"], "source")
    my_doc["title"] = is_field_in_doc(doc["_source"], "title")
    my_doc["abstract"] = is_field_in_doc(doc["_source"], "abstract")
    my_doc["collection"] = is_field_in_doc(doc["_source"], "id_sector")
    my_doc["author"] = is_field_in_doc(doc["_source"], "agent")
    my_doc["date"] = is_field_in_doc(doc["_source"], "date")
    my_doc["link_origin"] = is_field_in_doc(doc["_source"], "links")
    my_doc["mime_type"] = is_field_in_doc(doc["_source"], "format_used")
    my_doc["in_force"] = is_field_in_doc(doc["_source"], "into_force")
    my_doc["language"] = is_field_in_doc(doc["_source"], "list_lang_original")
    if is_field_in_doc(doc["_source"], "eurovoc_concept"):
        my_doc["eurovoc_concept"]["label"] = is_field_in_doc(doc["_source"], "eurovoc_concept")
        my_doc["eurovoc_concept"]["validated"] = "true"
    if is_field_in_doc(doc["_source"], "eurovoc_dom"):
        my_doc["eurovoc_domain"]["label"] = is_field_in_doc(doc["_source"], "eurovoc_dom")
        my_doc["eurovoc_domain"]["validated"] = "true"
    if is_field_in_doc(doc["_source"], "eurovoc_mth"):
        my_doc["eurovoc_mth"]["label"] = is_field_in_doc(doc["_source"], "eurovoc_mth")
        my_doc["eurovoc_mth"]["validated"] = "true"
    print(my_doc)
    response = es2.index(index=TO_INDEX_NAME, document=json.dumps(my_doc))
    print(response)
    doc_id = response["_id"]
    embs = Embeddings.get_embeddings(my_doc["title"], my_doc["abstract"], is_field_in_doc(doc["_source"], "text"))
    first = True
    for emb in embs:
        if first:
            update_fields = {"doc": {"chunk_text": emb["text"], "document_id": doc_id, "chunk_number": emb["chunk"],
                             "sbert_embedding": emb["vector"]}}
            #with curl
            # headers = {'content-type': 'application/json', 'Accept-Charset': 'UTF-8'}
            # url = "https://localhost:9200/" + TO_INDEX_NAME + "/_update/" + doc_id
            # res = requests.post(url=url, data=json.dumps(update_fields), headers=headers, verify=False, auth=("elastic","Bd88yLgN9e3R2ciVkEqI"))

            res = es2.update(index=TO_INDEX_NAME, id=doc_id, body={"doc": update_fields})
            first = False
            print(res)
        else:
            my_doc["chunk_text"] = emb["text"]
            my_doc["document_id"] = doc_id
            my_doc["chunk_number"] = emb["chunk"]
            my_doc["sbert_embedding"] = emb["vector"]
            resp = es2.index(index=TO_INDEX_NAME, body=my_doc)
            print(resp)

    if n == 1000:
        break
    n += 1
