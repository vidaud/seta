from seta_api.infrastructure.auth_validator import validate_view_permissions
from seta_api.infrastructure.ApiLogicError import ForbiddenResourceError, ApiLogicError
from .field_catalog import get_catalog_fields_name, get_catalog
from seta_api.infrastructure.helpers import is_field_in_doc
import pandas as pd
import io


def get_doc_from_es(id, fields, es, index):
    source = []
    available_fields = get_catalog_fields_name()
    available_fields.append("community_id")
    for field in fields:
        if field in available_fields:
            source.append(field)
    if "source" not in source:
        source.append("source")
    query = {"bool": {"must": [
        {"match": {
            "_id": id
        }}
    ]}}
    response = es.search(index=index, query=query, _source=source, size=1)
    doc = {}
    source_id = ""
    if "error" in response:
        raise ApiLogicError('Malformed query.')
    for document in response["hits"]["hits"]:
        source_id = document["_source"]["source"]
        for f in fields:
            if f not in available_fields:
                continue
            if f == "_id":
                doc[f] = document[f]
                continue
            if f == "community_id":
                #todo retrieve communty id from token
                doc[f] = None
                continue
            doc[f] = is_field_in_doc(document["_source"], f)
    return doc, source_id


def export(ids, fields, app, export_format):
    documents = []
    unique_ids = set(ids[:app.config["EXPORT_DOCUMENT_LIMIT"]])
    for id in unique_ids:
        doc, source = get_doc_from_es(id, fields, app.es, app.config["INDEX"])
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


def export_catalog():
    c = {"fields_catalog": get_catalog()}
    return c
