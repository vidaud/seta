from infrastructure.helpers import word_exists, sanitize_input
from infrastructure.ApiLogicError import ApiLogicError

def get_similar_words(term, n_term, current_app):
    if n_term is None:
        n_term = current_app.config["DEFAULT_TERM_NUMBER"]
    term = sanitize_input(term)
    words = {'words': []}
    
    if not word_exists(current_app.terms_model, term):
        return words
    
    for x, y in current_app.terms_model.wv.most_similar(term, topn=n_term):
        words['words'].append({"similarity": str(y)[:4],
                               "similar_word": x.replace('_', ' '),
                               "cardinality": str(+current_app.terms_model.wv.vocab[x].count)})
        
    return words

def most_similar(term, term_list, top_n, current_app):
    if top_n is None:
        top_n = 3
    if top_n > len(term_list):
        top_n = len(term_list)
    distances = {}
    term = sanitize_input(term)
    if not word_exists(current_app.terms_model, term):
        raise ApiLogicError('Term out of vocabulary.')
    for item in term_list:
        item = sanitize_input(item)
        if word_exists(current_app.terms_model, item):
            distances[item] = current_app.terms_model.wv.distance(term, item)
    distances = sorted(distances.items(), key=lambda kv: (kv[1], kv[0]))
    out = {'most-similar': []}
    for i in distances[:top_n]:
        out['most-similar'].append({'term': i[0], 'distance': i[1]})
        
    return out