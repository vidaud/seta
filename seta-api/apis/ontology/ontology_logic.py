from infrastructure.helpers import sanitize_input, word_exists
from infrastructure.ApiLogicError import ApiLogicError
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

def build_tree(term, current_app):
    term = sanitize_input(term)
    if not word_exists(current_app.terms_model, term):
        raise ApiLogicError('Term out of vocabulary.')
    
    terms_model = current_app.terms_model
    graphjs = {"nodes": []}
    

    nodes = [sanitize_input(x) for x, y in terms_model.wv.most_similar(term, topn=20)]
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
                if terms_model.similarity(n1, n2) > 0.7:
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
            for m in [sanitize_input(x) for x, y in terms_model.wv.most_similar(n, topn=7)]:
                if m not in done and m != term and m not in done2:
                    done2.append(m)
                    r2.append(m)
        graphjs["nodes"].append(r2)
        
    return graphjs