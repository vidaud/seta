from seta_api.infrastructure.ApiLogicError import ApiLogicError
from seta_api.infrastructure.utils.w2v_elasticsearch import (word_exists, get_size, 
                                                get_most_similar,is_similarity_gt_value)

import copy
from math import sqrt
import itertools


def build_graph(term, current_app):

    if not word_exists(current_app, term):
        raise ApiLogicError('Term out of vocabulary.')

    size = get_size(term, current_app)
    graphjs = {"nodes": [{"id": term, "depth": '0', "size": size, 'graph_size': sqrt(size) // 40 + 3}],
               "links": []}

    nodes = get_most_similar(term, current_app, 7)

    done = copy.deepcopy(nodes)
    done2 = []
    
    for c, n in enumerate(nodes):
        size = get_size(n, current_app)
        graphjs["nodes"].append({"id": n, "depth": '1', "size": size, "graph_size": sqrt(size) // 20 + 3})
        graphjs["links"].append({"source": term, "target": n, "value": .2})
        for m in get_most_similar(n, current_app, 5):
            if m not in done and m != term and m not in done2:
                size = get_size(m, current_app)
                done2.append(m)
                graphjs["nodes"].append({"id": m, "depth": '2', "size": size, "graph_size": sqrt(size) // 20 + 3})
                graphjs["links"].append({"source": n, "target": m, "value": .1})
            elif m in done2:
                graphjs["links"].append({"source": n, "target": m, "value": .1})
                
    return graphjs


def build_tree(term, current_app):
    if not word_exists(current_app, term):
        raise ApiLogicError('Term out of vocabulary.')

    graphjs = {"nodes": []}
    
    nodes = get_most_similar(term, current_app, 20)
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
            for m in get_most_similar(n, current_app, 7):
                if m not in done and m != term and m not in done2:
                    done2.append(m)
                    r2.append(m)
        graphjs["nodes"].append(r2)
        
    return graphjs