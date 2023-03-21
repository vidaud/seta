from seta_api.infrastructure.utils.embeddings import Embeddings
from seta_api.infrastructure.helpers import is_field_in_doc
from seta_api.infrastructure.ApiLogicError import ApiLogicError

from .corpus_build import build_corpus_request, compose_request_for_msearch
from .corpus_response import handle_corpus_response


def doc_by_id(doc_id, current_app):
    try:
        q = current_app.es.get(index=current_app.config['INDEX_PUBLIC'], id=doc_id)
        doc = q['_source']
        return doc
    except:
        raise ApiLogicError('ID not found.')


def delete_doc(id, current_app):
    try:
        current_app.es.delete(index=current_app.config['INDEX_PUBLIC'], id=id)
    except:
        raise ApiLogicError("id not found")


def insert_doc(args, current_app):
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
    new_doc["eurovoc_concept"] = is_field_in_doc(args, "eurovoc_concept")
    new_doc["eurovoc_domain"] = is_field_in_doc(args, "eurovoc_domain")
    new_doc["eurovoc_mth"] = is_field_in_doc(args, "eurovoc_mth")
    new_doc["ec_priority"] = is_field_in_doc(args, "ec_priority")
    new_doc["sdg_domain"] = is_field_in_doc(args, "sdg_domain")
    new_doc["sdg_subdomain"] = is_field_in_doc(args, "sdg_subdomain")
    new_doc["euro_sci_voc"] = is_field_in_doc(args, "euro_sci_voc")
    new_doc["other"] = is_field_in_doc(args, "other")
    new_doc["keywords"] = is_field_in_doc(args, "keywords")

    index = current_app.config["INDEX_PUBLIC"]
    res = current_app.es.index(index=index, document=new_doc)
    doc_id = res["_id"]
    embs = Embeddings.embeddings_from_doc_fields(args["title"], args["abstract"], args["text"])
    first = True
    for emb in embs:
        if first:
            update_fields = {"chunk_text": emb["text"], "document_id": doc_id, "chunk_number": emb["chunk"],
                             "sbert_embedding": emb["vector"]}
            current_app.es.update(index=index, id=doc_id, doc=update_fields)
            first = False
        else:
            new_doc["chunk_text"] = emb["text"]
            new_doc["document_id"] = doc_id
            new_doc["chunk_number"] = emb["chunk"]
            new_doc["sbert_embedding"] = emb["vector"]
            current_app.es.index(index=index, document=new_doc)
    return doc_id


def corpus(term, n_docs, from_doc, sources, collection, reference, eurovoc_concept, eurovoc_dom, eurovoc_mth,
           ec_priority, sdg_domain, sdg_subdomain, euro_sci_voc, in_force, sort, semantic_sort_id, emb_vector,
           semantic_sort_id_list, emb_vector_list, author, date_range, aggs, search_type, other, current_app):
    if search_type is None or search_type not in current_app.config["SEARCH_TYPES"]:
        search_type = "CHUNK_SEARCH"
    if n_docs is None:
        n_docs = current_app.config["DEFAULT_DOCS_NUMBER"]
    if from_doc is None:
        from_doc = current_app.config["DEFAULT_FROM_DOC_NUMBER"]

    body = build_corpus_request(term, n_docs, from_doc, sources, collection, reference, eurovoc_concept, eurovoc_dom,
                                eurovoc_mth, ec_priority, sdg_domain, sdg_subdomain, euro_sci_voc, in_force, sort,
                                semantic_sort_id, emb_vector, semantic_sort_id_list, emb_vector_list, author,
                                date_range, aggs, search_type, other, current_app)
    request = compose_request_for_msearch(body, current_app)
    res = current_app.es.msearch(searches=request)
    documents = handle_corpus_response(aggs, res, search_type, semantic_sort_id, term)
    return documents
