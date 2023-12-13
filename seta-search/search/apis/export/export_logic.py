from search.infrastructure.auth_validator import validate_view_permissions, get_resource_permissions
from search.infrastructure.ApiLogicError import ForbiddenResourceError, ApiLogicError
from search.infrastructure.helpers import is_field_in_doc
import pandas as pd
import io
import requests


def get_catalog_fields_name(app, request):
    url = app.config.get("CATALOGUE_API_ROOT_URL") + "fields"
    try:
        result = requests.get(url=url, headers=request.headers, cookies=request.cookies)
    except:
        raise ApiLogicError("catalog api error")
    names = []
    for f in result.json():
        names.append(f["name"])
    return names


def retrieve_community_id(source):
    resources = get_resource_permissions("view")
    if resources is not None:
        for r in resources:
            if r["resource_id"].lower() == source.lower():
                return r["community_id"]
    return None


def get_doc_from_es(doc_tuple, fields, app, request):
    doc_id = doc_tuple[0]
    doc_path = doc_tuple[1]
    es = app.es
    index = app.config["INDEX"]
    source = []
    available_fields = get_catalog_fields_name(app, request)
    for field in fields:
        if field in available_fields:
            source.append(field)
    if "source" not in source:
        source.append("source")
    body = {"query": {"bool": {"must": [{"match": {"_id": doc_id}}]}}}
    response = es.search(index=index, body=body, _source=source, size=1)
    doc = {}
    source_id = ""
    if "error" in response:
        raise ApiLogicError('Malformed query.')
    for document in response["hits"]["hits"]:
        source_id = document["_source"]["source"]
        for f in fields:
            if f == "path":
                doc[f] = doc_path
                continue
            if f not in available_fields:
                continue
            if f == "_id":
                doc[f] = document[f]
                continue
            if f == "community_id":
                community_id = retrieve_community_id(source_id)
                doc[f] = community_id
                continue
            doc[f] = is_field_in_doc(document["_source"], f)
    return doc, source_id


def from_json_obj_to_tuple(ids):
    ids_tuple = []
    for obj in ids:
        t = (obj["id"], obj["path"])
        ids_tuple.append(t)
    return ids_tuple


def export(ids, fields, app, export_format, request):
    documents = []
    ids_tuple = from_json_obj_to_tuple(ids)
    unique_ids = set(ids_tuple[:app.config["EXPORT_DOCUMENT_LIMIT"]])
    for doc_tuple in unique_ids:
        doc, source = get_doc_from_es(doc_tuple, fields, app, request)
        try:
            validate_view_permissions([source])
        except ForbiddenResourceError:
            continue
        except:
            raise ApiLogicError("export error")
        documents.append(doc)
    if export_format == "text/csv":
        df = pd.DataFrame(documents)
        csv_buffer = io.StringIO()
        df.to_csv(csv_buffer, index=False)
        csv_output = csv_buffer.getvalue()
        csv_buffer.close()
        return csv_output
    if export_format == "application/json":
        return {"documents": documents}

