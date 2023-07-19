from seta_api.infrastructure.utils.embeddings import Embeddings
from seta_api.infrastructure.helpers import is_field_in_doc
from seta_api.infrastructure.ApiLogicError import ApiLogicError

from .corpus_build import build_corpus_request, compose_request_for_msearch
from .corpus_response import handle_corpus_response
from .taxonomy import Taxonomy


def chunk_by_id(doc_id, es, index):
    tax = Taxonomy()
    try:
        q = es.get(index=index, id=doc_id)
        doc = q['_source']
        doc['_id'] = q['_id']
        tax.create_tree_from_elasticsearch_format(is_field_in_doc(doc, "taxonomy"), is_field_in_doc(doc, "taxonomy_path"))
        doc['taxonomy'] = tax.tree
        return doc
    except:
        raise ApiLogicError('ID not found.')


def delete_chunk(id, es, index):
    try:
        es.delete(index=index, id=id)
    except:
        raise ApiLogicError("ID not found")


def update_chunk(id, es, fields, index):
    res = ""
    try:
        res = es.update(index=index, id=id, doc=fields)
    except:
        raise ApiLogicError('Update not performed', res)


def document_by_id(doc_id, n_docs, from_doc, current_app):
    tax = Taxonomy()
    resp = {"chunk_list": []}
    if n_docs is None:
        n_docs = current_app.config["DEFAULT_DOCS_NUMBER"]
    if from_doc is None:
        from_doc = current_app.config["DEFAULT_FROM_DOC_NUMBER"]
    elif from_doc + n_docs > current_app.config["PAGINATION_DOC_LIMIT"]:
        return resp
    try:
        body = {"size": n_docs,
                "from": from_doc,
                "query": {"bool": {"must": [{"match": {"document_id": doc_id}}]}},
                          "sort": [{"chunk_number": {"order": "asc"}}]}

        request = compose_request_for_msearch(body, current_app)
        res = current_app.es.msearch(searches=request)
        for response in res["responses"]:
            for doc in response["hits"]["hits"]:
                document = doc["_source"]
                document['_id'] = doc['_id']
                tax.create_tree_from_elasticsearch_format(is_field_in_doc(document, "taxonomy"),
                                                          is_field_in_doc(document, "taxonomy_path"))
                document["taxonomy"] = tax.tree
                resp["chunk_list"].append(document)
    except:
        raise ApiLogicError('ID not found.')
    return resp


def delete_document(id, es, index):
    try:
        query = {"query": {"bool": {"must": [{"match": {"document_id": id}}]}}}
        es.delete_by_query(index=index, body=query)
    except:
        raise ApiLogicError("id not found")

def insert_chunk(args, es, index):
    new_doc = {}
    new_doc["id"] = is_field_in_doc(args, "id")
    new_doc["id_alias"] = is_field_in_doc(args, "id_alias")
    new_doc["source"] = is_field_in_doc(args, "source")
    new_doc["title"] = is_field_in_doc(args, "title")
    new_doc["abstract"] = is_field_in_doc(args, "abstract")
    new_doc["collection"] = is_field_in_doc(args, "collection")
    new_doc["reference"] = is_field_in_doc(args, "reference")
    new_doc["author"] = is_field_in_doc(args, "author")
    new_doc["date"] = is_field_in_doc(args, "date")
    new_doc["link_origin"] = is_field_in_doc(args, "link_origin")
    new_doc["link_alias"] = is_field_in_doc(args, "link_alias")
    new_doc["link_related"] = is_field_in_doc(args, "link_related")
    new_doc["link_reference"] = is_field_in_doc(args, "link_reference")
    new_doc["mime_type"] = is_field_in_doc(args, "mime_type")
    new_doc["in_force"] = is_field_in_doc(args, "in_force")
    new_doc["language"] = is_field_in_doc(args, "language")
    new_doc["taxonomy"], new_doc["taxonomy_path"] = Taxonomy.from_tree_to_elasticsearch_format(
        is_field_in_doc(args, "taxonomy"))
    new_doc["other"] = is_field_in_doc(args, "other")
    new_doc["keywords"] = is_field_in_doc(args, "keywords")
    new_doc["chunk_text"] = is_field_in_doc(args, "chunk_text")
    new_doc["document_id"] = is_field_in_doc(args, "document_id")
    new_doc["chunk_number"] = is_field_in_doc(args, "chunk_number")
    new_doc["sbert_embedding"] = get_embeddings(args)
    res = es.index(index=index, document=new_doc)
    return res["_id"]


def get_embeddings(args):
    if is_field_in_doc(args, "sbert_embedding"):
        return args["sbert_embedding"]
    return Embeddings.embedding_vector_from_text(is_field_in_doc(args, "chunk_text"))


def insert_doc(args, es, index):
    new_doc = {}
    new_doc["id"] = is_field_in_doc(args, "id")
    new_doc["id_alias"] = is_field_in_doc(args, "id_alias")
    new_doc["source"] = is_field_in_doc(args, "source")
    new_doc["title"] = is_field_in_doc(args, "title")
    new_doc["abstract"] = is_field_in_doc(args, "abstract")
    new_doc["collection"] = is_field_in_doc(args, "collection")
    new_doc["reference"] = is_field_in_doc(args, "reference")
    new_doc["author"] = is_field_in_doc(args, "author")
    new_doc["date"] = is_field_in_doc(args, "date")
    new_doc["link_origin"] = is_field_in_doc(args, "link_origin")
    new_doc["link_alias"] = is_field_in_doc(args, "link_alias")
    new_doc["link_related"] = is_field_in_doc(args, "link_related")
    new_doc["link_reference"] = is_field_in_doc(args, "link_reference")
    new_doc["mime_type"] = is_field_in_doc(args, "mime_type")
    new_doc["in_force"] = is_field_in_doc(args, "in_force")
    new_doc["language"] = is_field_in_doc(args, "language")
    new_doc["taxonomy"], new_doc["taxonomy_path"] = Taxonomy.from_tree_to_elasticsearch_format(is_field_in_doc(args, "taxonomy"))
    new_doc["other"] = is_field_in_doc(args, "other")
    new_doc["keywords"] = is_field_in_doc(args, "keywords")

    res = es.index(index=index, document=new_doc)
    doc_id = res["_id"]
    embs = Embeddings.chunks_and_embeddings_from_doc_fields(is_field_in_doc(args, "title"),
                                                            is_field_in_doc(args, "abstract"),
                                                            is_field_in_doc(args, "text"))
    first = True
    for emb in embs:
        if first:
            update_fields = {"chunk_text": emb["text"], "document_id": doc_id, "chunk_number": emb["chunk"],
                             "sbert_embedding": emb["vector"]}
            es.update(index=index, id=doc_id, doc=update_fields)
            first = False
        else:
            new_doc["chunk_text"] = emb["text"]
            new_doc["document_id"] = doc_id
            new_doc["chunk_number"] = emb["chunk"]
            new_doc["sbert_embedding"] = emb["vector"]
            es.index(index=index, document=new_doc)
    return doc_id


def corpus(term, n_docs, from_doc, sources, collection, reference, in_force, sort, taxonomy_path, semantic_sort_id,
           emb_vector, semantic_sort_id_list, emb_vector_list, author, date_range, aggs, search_type, other,
           current_app):
    if search_type is None or search_type not in current_app.config["SEARCH_TYPES"]:
        search_type = "CHUNK_SEARCH"
    if n_docs is None:
        n_docs = current_app.config["DEFAULT_DOCS_NUMBER"]
    if from_doc is None:
        from_doc = current_app.config["DEFAULT_FROM_DOC_NUMBER"]
    elif from_doc + n_docs > current_app.config["PAGINATION_DOC_LIMIT"]:
        return {"total_docs": 0, "documents": []}

    body = build_corpus_request(term, n_docs, from_doc, sources, collection, reference, in_force, sort, taxonomy_path,
                                semantic_sort_id, emb_vector, semantic_sort_id_list, emb_vector_list, author,
                                date_range, aggs, search_type, other, current_app)
    # import json
    # print(json.dumps(body))
    request = compose_request_for_msearch(body, current_app)
    res = current_app.es.msearch(searches=request)
    documents = handle_corpus_response(aggs, res, search_type, term, current_app)
    return documents


def get_source_from_chunk_list(chunk_list):
    for doc in chunk_list:
        if "source" in doc:
            return doc["source"]
