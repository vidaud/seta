from flask import json
from .corpus_build_search import build_search_query
from seta_api.infrastructure.ApiLogicError import ApiLogicError
import copy


def retrieve_vector_list(semantic_sort_id_list, emb_vector_list, current_app):
    vectors = []
    if semantic_sort_id_list:
        for id in semantic_sort_id_list:
            vector = get_vector(id, current_app)
            vectors.append(vector)
    elif emb_vector_list:
        vectors = emb_vector_list
    return vectors


def create_knn_query(semantic_sort_id_list, emb_vector_list, current_app, k, query):
    vectors = retrieve_vector_list(semantic_sort_id_list, emb_vector_list, current_app)
    if not vectors:
        raise ApiLogicError('Sbert vector is not retrieved')
    knn = []
    for vector in vectors:
        item = {"field": "sbert_embedding",
                "query_vector": vector,
                "k": k,
                "num_candidates": current_app.config["KNN_SEARCH_NUM_CANDIDATES"],
                "similarity": current_app.config["SIMILARITY_THRESHOLD"],
                "filter": query}
        knn.append(item)
    return knn


def build_corpus_request(term, n_docs, from_doc, sources, collection, reference, in_force, sort, taxonomy_path,
                         semantic_sort_id_list, emb_vector_list, author, date_range,
                         aggs, search_type, other, current_app):
    query = build_search_query(term, sources, collection, reference, in_force, author, date_range, search_type,
                               other, taxonomy_path)
    body = {
        "size": n_docs,
        "from": from_doc,
        "track_total_hits": True,
        "_source": ["id", "id_alias", "document_id", "source", "title", "abstract", "chunk_text", "chunk_number",
                    "collection", "reference", "author", "date", "link_origin", "link_alias", "link_related",
                    "link_reference", "mime_type", "in_force", "language", "taxonomy", "taxonomy_path",
                    "keywords", "other"]
    }
    if search_type == "CHUNK_SEARCH":
        body["collapse"] = {"field": "document_id"}
        body["aggs"] = {"total": {"cardinality": {"field": "document_id"}}}

    if emb_vector_list or semantic_sort_id_list:
        body = add_knn_search_query(current_app, emb_vector_list, semantic_sort_id_list, body, query)
    else:
        body["query"] = query

    body = fill_body_for_sort(body, sort)
    body = fill_body_for_aggregations(aggs, body, current_app, search_type)
    return body


def compose_request_for_msearch(body, current_app):
    search_arr = [{'index': current_app.config["INDEX"][0]}, body]
    request = ''
    for each in search_arr:
        request += '%s \n' % json.dumps(each)
    return request


def fill_body_for_sort(body, sort):
    if sort:
        sort_list = build_sort_body(sort)
        body['sort'] = []
        for sort_item in sort_list:
            body['sort'].append(sort_item)
    return body


def add_knn_search_query(current_app, emb_vector_list, semantic_sort_id_list,
                         body, query):
    if semantic_sort_id_list or emb_vector_list:
        k = current_app.config["KNN_SEARCH_K"]
        body["knn"] = create_knn_query(semantic_sort_id_list, emb_vector_list, current_app, k, query)
    return body


def fill_body_for_aggregations(aggs, body, current_app, search_type):
    aggregation_size = 1000
    if not aggs:
        return body
    for agg in aggs:
        match agg:
            case agg if agg.startswith("taxonomy:"):
                agg_body = {"terms": {"field": "taxonomy_path", "size": aggregation_size}}
                check_search_type_for_unique_aggs(agg_body, search_type)
                body = add_aggs(agg_body, "taxonomy", body)
            case "taxonomies":
                agg_body = {"terms": {"field": "taxonomy_path", "size": aggregation_size}}
                check_search_type_for_unique_aggs(agg_body, search_type)
                body = add_aggs(agg_body, agg, body)
            case agg if agg.startswith("taxonomy_path_years-"):
                agg_body = {"terms": {"field": "taxonomy_path", "size": aggregation_size}}
                #TODO add check for unique value in years
                agg_body["aggs"] = {
                    "years": {"date_histogram": {"field": "date", "calendar_interval": "year", "format": "yyyy"},
                              "aggs": {"unique_values": {"cardinality": {"field": "document_id"}}}}}
                check_search_type_for_unique_aggs(agg_body, search_type)
                body = add_aggs(agg_body, "taxonomy_path_years", body)
            case "source":
                agg_body = {"terms": {"field": agg + '.keyword', "size": aggregation_size}}
                check_search_type_for_unique_aggs(agg_body, search_type)
                body = add_aggs(agg_body, agg, body)
            case "date_year":
                agg_body = {"date_histogram": {"field": "date", "calendar_interval": "year", "format": "yyyy"}}
                check_search_type_for_unique_aggs(agg_body, search_type)
                body = add_aggs(agg_body, "years", body)
            case "source_collection_reference":
                agg_body = {"multi_terms": {"terms": [{"field": "source.keyword"},
                                                      {"field": "collection.keyword",
                                                       "missing": current_app.config["AGG_MISSING_NAME"]},
                                                      {"field": "reference.keyword",
                                                       "missing": current_app.config["AGG_MISSING_NAME"]}],
                                            "size": aggregation_size}}
                check_search_type_for_unique_aggs(agg_body, search_type)
                body = add_aggs(agg_body, agg, body)
            case _:
                raise ApiLogicError('Malformed query. Wrong aggs parameter.')
    return body


def check_search_type_for_unique_aggs(agg_body, search_type):
    if search_type == "CHUNK_SEARCH":
        if "aggs" in agg_body:
            agg_body["aggs"]["unique_values"] = {"cardinality": {"field": "document_id"}}
        else:
            agg_body["aggs"] = {"unique_values": {"cardinality": {"field": "document_id"}}}


def add_aggs(agg_body, aggs_name, body):
    if "aggs" in body:
        body['aggs'][aggs_name] = agg_body
    else:
        body['aggs'] = {aggs_name: agg_body}
    return body


def get_vector(semantic_sort_id, current_app):
    body = {"query": {"bool": {"must": [{"match": {"_id": {"query": semantic_sort_id}}}]}}}
    res = current_app.es.search(index=current_app.config["INDEX"], body=body, _source=["sbert_embedding"])
    vector = None
    if res['hits']['total']['value'] > 0:
        vector = res['hits']['hits'][0]['_source']['sbert_embedding']
    return vector


def build_sort_body(sort):
    sort_list = []
    for item in sort:
        item_list = item.split(':')
        sort_item = {item_list[0]: {"order": item_list[1]}}
        sort_list.append(sort_item)
    return sort_list
