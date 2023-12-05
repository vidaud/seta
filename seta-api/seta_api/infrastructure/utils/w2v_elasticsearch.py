from seta_api.infrastructure.utils.crc import get_crc_from_es


def get_most_similar(term, current_app, top_n):
    current_crc, crc_id = get_crc_from_es(current_app.es, current_app.config["INDEX_SUGGESTION"])

    body = {"query": {"bool": {"must": [{"match": {"phrase.keyword": term}},
                                        {"match": {"crc.keyword": current_crc}}]}}}

    resp = current_app.es.search(index=current_app.config["INDEX_SUGGESTION"], body=body,
                                 _source=["most_similar.term"])
    terms = []
    for r in resp["hits"]["hits"]:
        for t in r["_source"]["most_similar"]:
            terms.append(t["term"])
    return terms[:top_n]


def get_most_similar_with_score_and_size(term, current_app, top_n):
    current_crc, crc_id = get_crc_from_es(current_app.es, current_app.config["INDEX_SUGGESTION"])

    body = {"query": {"bool": {"must": [{"match": {"phrase.keyword": term}},
                                        {"match": {"crc.keyword": current_crc}}]}}}

    resp = current_app.es.search(index=current_app.config["INDEX_SUGGESTION"], body=body,
                                 _source=["most_similar.term", "most_similar.score", "most_similar.size"])
    terms = []
    for r in resp["hits"]["hits"]:
        for t in r["_source"]["most_similar"]:
            term_tuple = (t["term"], t["score"], t["size"])
            terms.append(term_tuple)
    return terms[:top_n]


def word_exists(current_app, term):
    current_crc, crc_id = get_crc_from_es(current_app.es, current_app.config["INDEX_SUGGESTION"])
    body = {"query": {"bool": {"must": [{"match": {"phrase.keyword": term}},
                               {"match": {"crc.keyword": current_crc}}]}}}
    resp = current_app.es.search(index=current_app.config["INDEX_SUGGESTION"], body=body)
    if resp['hits']['total']['value'] == 0:
        return False
    else:
        return True


def get_most_similar_gt_value(term, current_app, value):
    current_crc, crc_id = get_crc_from_es(current_app.es, current_app.config["INDEX_SUGGESTION"])

    body = {"query": {"bool": {"must": [{"match": {"phrase.keyword": term}},
                                        {"match": {"crc.keyword": current_crc}}]}}}

    resp = current_app.es.search(index=current_app.config["INDEX_SUGGESTION"], body=body,
                                 _source=["most_similar.term", "most_similar.score"])
    terms = []
    for r in resp["hits"]["hits"]:
        for t in r["_source"]["most_similar"]:
            if t["score"] > value:
                terms.append(t["term"])
    return terms


def is_similarity_gt_value(term1, term2, value, current_app):
    most_similar_t1 = get_most_similar_gt_value(term1, current_app, value)
    most_similar_t2 = get_most_similar_gt_value(term2, current_app, value)
    if term1 in most_similar_t2 or term2 in most_similar_t1:
        return True
    else:
        return False


def get_size(word, current_app):
    current_crc, crc_id = get_crc_from_es(current_app.es, current_app.config["INDEX_SUGGESTION"])
    body = {"query": {"bool": {"must": [{"match": {"phrase.keyword": word}},
                               {"match": {"crc.keyword": current_crc}}]}}}
    resp = current_app.es.search(index=current_app.config["INDEX_SUGGESTION"], body=body,
                                 _source=["size"])
    if resp['hits']['total']['value'] == 1:
        return resp["hits"]["hits"][0]["_source"]["size"]
    else:
        return 0
