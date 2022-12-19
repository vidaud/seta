import json
from .corpus_build_search import build_search_query
from infrastructure.ApiLogicError import ApiLogicError

def build_corpus_request(term, n_docs, from_doc, sources, collection, reference, eurovoc_concept, eurovoc_dom,
                         eurovoc_mth, ec_priority, sdg_domain, sdg_subdomain, euro_sci_voc, in_force, sort,
                         semantic_sort_id, emb_vector, author, date_range, aggs, search_type, other, current_app):
    query = build_search_query(term, sources, collection, reference, eurovoc_concept, eurovoc_dom, eurovoc_mth,
                               ec_priority, sdg_domain, sdg_subdomain, euro_sci_voc, in_force, author, date_range,
                               search_type, other)
    if semantic_sort_id or emb_vector:
        sort = None
        if semantic_sort_id:
            vector = get_vector(semantic_sort_id, current_app)
        else:
            vector = emb_vector
        if not vector:
            raise ApiLogicError('Sbert vector is not retrieved')
        query_to_use = {"script_score": {
            "query": query, "script": {
                "source": "cosineSimilarity(params.queryVector, 'sbert_embedding') + 1.0",
                "params": {"queryVector": vector}}}}
    else:
        query_to_use = query
    if n_docs is None:
        n_docs = current_app.config["DEFAULT_DOCS_NUMBER"] 
    if from_doc is None:
        from_doc = current_app.config["DEFAULT_FROM_DOC_NUMBER"] 
    if sort:
        sort_list = build_sort_body(sort)

    #print(query_to_use)
    body = {       
        "size": n_docs,
        "from": from_doc,
        "track_total_hits": True,
        "query": query_to_use,
        "_source": ["id",             "id_alias",        "document_id",    "source", 
                    "title",          "abstract",        "chunk_text",     "chunk_number", "collection",
                    "reference",      "author",          "date",           "link_origin",  "link_alias", 
                    "link_related",   "link_reference",  "mime_type",      "in_force",     
                    "language",       "eurovoc_concept", "eurovoc_domain", "eurovoc_mth",  "ec_priority", 
                    "sdg_domain",     "sdg_subdomain",   "euro_sci_voc",   "keywords",     "other"]
    }

    if search_type == "CHUNK_SEARCH":
        body["collapse"] = {"field": "document_id"}
        body["aggs"] = {"total": {"cardinality": {"field": "document_id"}}}
    if sort:
        body['sort'] = []
        for sort_item in sort_list:
            body['sort'].append(sort_item)
    if aggs:
        if aggs == "source" or aggs == "eurovoc_concept":
            f_aggs = aggs + '.keyword'
            if body["aggs"]:
                body['aggs'][aggs] = {"terms": {"field": f_aggs}}
            else:
                body['aggs'] = {aggs: {"terms": {"field": f_aggs}}}
        if aggs == "date_year":
                if "aggs" in body:
                  body['aggs']["years"] = {"date_histogram": {"field": "date", "calendar_interval": "year", "format": "yyyy" }}
                else:
                  body['aggs'] = {"years": {"date_histogram": {"field": "date", "calendar_interval": "year", "format": "yyyy" }}}
    search_arr = []
    search_arr.append({'index': current_app.config["INDEX"][0]})
    search_arr.append(body)
    request = ''
    for each in search_arr:
        request += '%s \n' % json.dumps(each)
    return request

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

