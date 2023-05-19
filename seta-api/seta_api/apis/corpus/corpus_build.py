from flask import json
from .corpus_build_search import build_search_query
from seta_api.infrastructure.ApiLogicError import ApiLogicError


def retrieve_vector_list(semantic_sort_id, emb_vector, semantic_sort_id_list, emb_vector_list, current_app):
    vectors = []
    if semantic_sort_id:
        vector = get_vector(semantic_sort_id, current_app)
        vectors.append(vector)
    elif emb_vector:
        vectors.append(emb_vector)
    elif semantic_sort_id_list:
        for id in semantic_sort_id_list:
            vector = get_vector(id, current_app)
            vectors.append(vector)
    elif emb_vector_list:
        vectors = emb_vector_list
    return vectors


def embeddings_query(semantic_sort_id, emb_vector, semantic_sort_id_list, emb_vector_list, current_app, query):
    vectors = retrieve_vector_list(semantic_sort_id, emb_vector, semantic_sort_id_list, emb_vector_list, current_app)
    if not vectors:
        raise ApiLogicError('Sbert vector is not retrieved')
    source = ""
    for i in range(len(vectors)):
        if source == "":
            source = "cosineSimilarity(params.queryVector[" + str(i) + "], 'sbert_embedding') + 1.0"
        else:
            source = source + " + cosineSimilarity(params.queryVector[" + str(i) + "], 'sbert_embedding') + 1.0"
    query_to_use = {"script_score": {
        "query": query, "script": {
            "source": source,
            "params": {"queryVector": vectors}}}}
    return query_to_use


def build_corpus_request(term, n_docs, from_doc, sources, collection, reference, in_force, sort, taxonomy_path,
                         semantic_sort_id, emb_vector, semantic_sort_id_list, emb_vector_list, author, date_range,
                         aggs, search_type, other, current_app):
    query = build_search_query(term, sources, collection, reference, in_force, author, date_range, search_type,
                               other, taxonomy_path)
    query_to_use = check_embeddings_query(current_app, emb_vector, emb_vector_list, query, semantic_sort_id,
                                          semantic_sort_id_list)

    body = {
        "size": n_docs,
        "from": from_doc,
        "track_total_hits": True,
        "query": query_to_use,
        "_source": ["id", "id_alias", "document_id", "source", "title", "abstract", "chunk_text", "chunk_number",
                    "collection", "reference", "author", "date", "link_origin", "link_alias", "link_related",
                    "link_reference", "mime_type", "in_force", "language", "taxonomy", "taxonomy_path",
                    "keywords", "other"]
    }

    if search_type == "CHUNK_SEARCH":
        body["collapse"] = {"field": "document_id"}
        body["aggs"] = {"total": {"cardinality": {"field": "document_id"}}}

    body = fill_body_for_sort(body, emb_vector, semantic_sort_id, sort)
    body = fill_body_for_aggregations(aggs, body)
    return body


def compose_request_for_msearch(body, current_app):
    search_arr = [{'index': current_app.config["INDEX"][0]}, body]
    request = ''
    for each in search_arr:
        request += '%s \n' % json.dumps(each)
    return request


def fill_body_for_sort(body, emb_vector, semantic_sort_id, sort):
    if sort:
        if semantic_sort_id or emb_vector:
            # embeddings define sorting, sort parameter must be ignored
            pass
        else:
            sort_list = build_sort_body(sort)
            body['sort'] = []
            for sort_item in sort_list:
                body['sort'].append(sort_item)
    return body


def check_embeddings_query(current_app, emb_vector, emb_vector_list, query, semantic_sort_id, semantic_sort_id_list):
    if semantic_sort_id or emb_vector:
        query_to_use = embeddings_query(semantic_sort_id, emb_vector, semantic_sort_id_list, emb_vector_list,
                                        current_app, query)
    else:
        query_to_use = query
    return query_to_use


def fill_body_for_aggregations(aggs, body):
    aggregation_size = 1000
    if not aggs:
        return body
    for agg in aggs:
        match agg:
            case agg if agg.startswith("taxonomy:"):
                agg_body = {"terms": {"field": "taxonomy_path", "size": aggregation_size}}
                body = add_aggs(agg_body, "taxonomy", body)
            case "taxonomies":
                agg_body = {"terms": {"field": "taxonomy_path", "size": aggregation_size}}
                body = add_aggs(agg_body, agg, body)
            case "source":
                agg_body = {"terms": {"field": agg + '.keyword', "size": aggregation_size}}
                body = add_aggs(agg_body, agg, body)
            case "date_year":
                agg_body = {"date_histogram": {"field": "date", "calendar_interval": "year", "format": "yyyy"}}
                body = add_aggs(agg_body, "years", body)
            case "source_collection_reference":
                agg_body = {"multi_terms": {"terms": [{"field": "source.keyword"},
                                                      {"field": "collection.keyword", "missing": "NO_CLASS"},
                                                      {"field": "reference.keyword", "missing": "NO_CLASS"}],
                                            "size": aggregation_size}}
                body = add_aggs(agg_body, agg, body)
            case _:
                raise ApiLogicError('Malformed query. Wrong aggs parameter.')
    return body


def add_aggs(agg_body, aggs_name, body):
    if "aggs" in body:
        body['aggs'][aggs_name] = agg_body
    else:
        body['aggs'] = {aggs_name: agg_body}
    return body


def get_vector(semantic_sort_id, current_app):
    query = {"bool": {"must": [{"match": {"_id": {"query": semantic_sort_id}}}]}}
    res = current_app.es.search(index=current_app.config["INDEX"], query=query, _source=["sbert_embedding"])
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

