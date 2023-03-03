from infrastructure.helpers import sanitize_input, word_exists, revert_sanitize_input
from infrastructure.ApiLogicError import ApiLogicError
from infrastructure.utils.crc import get_crc_from_es
import copy
from math import sqrt
import itertools


def build_graph(term, current_app):
    term = sanitize_input(term)
    
    if not word_exists(current_app.terms_model, term):
        raise ApiLogicError('Term out of vocabulary.')
    
    terms_model = current_app.terms_model
    
    size = terms_model.wv.vocab[term].count
    graphjs = {"nodes": [{"id": term, "depth": '0', "size": size, 'graph_size': sqrt(size) // 40 + 3}],
               "links": []}
    maxwords = 7
    nodes = [x for x, y in terms_model.wv.most_similar(term, topn=maxwords)]
    
    done = copy.deepcopy(nodes)
    done2 = []
    
    for c, n in enumerate(nodes):
        size = terms_model.wv.vocab[n].count
        graphjs["nodes"].append({"id": n, "depth": '1', "size": size, "graph_size": sqrt(size) // 20 + 3})
        graphjs["links"].append({"source": term, "target": n, "value": .2})
        for m in [x for x, y in terms_model.wv.most_similar(n, topn=5)]:
            if m not in done and m != term and m not in done2:
                size = terms_model.wv.vocab[m].count
                done2.append(m)
                graphjs["nodes"].append({"id": m, "depth": '2', "size": size, "graph_size": sqrt(size) // 20 + 3})
                graphjs["links"].append({"source": n, "target": m, "value": .1})
            elif m in done2:
                graphjs["links"].append({"source": n, "target": m, "value": .1})
                
    return graphjs


def get_most_similar(term, current_app):
    current_crc, crc_id = get_crc_from_es(current_app.es, current_app.config["INDEX_SUGGESTION"])

    query_similar_terms = {"bool": {"must": [{"match": {"phrase.keyword": term}},
                                             {"match": {"crc.keyword": current_crc}}]}}

    resp = current_app.es.search(index=current_app.config["INDEX_SUGGESTION"], query=query_similar_terms,
                                 _source=["most_similar.term"])
    terms = []
    for r in resp["hits"]["hits"]:
        for t in r["_source"]["most_similar"]:
            terms.append(t["term"])
    return terms


def word_exists_index(current_app, term):
    current_crc, crc_id = get_crc_from_es(current_app.es, current_app.config["INDEX_SUGGESTION"])
    query = {"bool": {"must": [{"match": {"phrase.keyword": term}},
                               {"match": {"crc.keyword": current_crc}}]}}
    resp = current_app.es.search(index=current_app.config["INDEX_SUGGESTION"], query=query)
    if resp['hits']['total']['value'] == 0:
        return False
    else:
        return True


def get_most_similar_gt_value(term, current_app, value):
    current_crc, crc_id = get_crc_from_es(current_app.es, current_app.config["INDEX_SUGGESTION"])

    query_similar_terms = {"bool": {"must": [{"match": {"phrase.keyword": term}},
                                             {"match": {"crc.keyword": current_crc}}]}}

    resp = current_app.es.search(index=current_app.config["INDEX_SUGGESTION"], query=query_similar_terms,
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


def build_tree(term, current_app):
    if not word_exists_index(current_app, term):
        raise ApiLogicError('Term out of vocabulary.')

    graphjs = {"nodes": []}
    
    nodes = get_most_similar(term, current_app)
    nodes2 = []
    done = []
    done2 = []
    for i in range(0, len(nodes)):
        n1 = nodes[i]
        if n1 not in done and n1 != term and n1 not in done2:
            done.append(n1)
            r = [n1]
            for j in range(i + 1, len(nodes)):
                n2 = nodes[j]
                if is_similarity_gt_value(n1, n2, 0.7, current_app):
                    if n2 not in done and n2 != term and n2 not in done2:
                        done2.append(n2)
                        r.append(n2)
            nodes2.append(r)
    nodes2 = nodes2[:15]
    done = list(itertools.chain.from_iterable(nodes2))
    done2 = []
    for r in nodes2:
        r2 = copy.deepcopy(r)
        for n in r:
            for m in get_most_similar(n, current_app)[:7]:
                if m not in done and m != term and m not in done2:
                    done2.append(m)
                    r2.append(m)
        graphjs["nodes"].append(r2)
        
    return graphjs