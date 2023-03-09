from seta_api.infrastructure.utils.w2v_elasticsearch import word_exists, get_most_similar_with_score_and_size

def get_similar_words(term, n_term, current_app):
    if n_term is None:
        n_term = current_app.config["DEFAULT_TERM_NUMBER"]
    words = {'words': []}
    
    if not word_exists(current_app, term):
        return words

    similar_words = get_most_similar_with_score_and_size(term, current_app, n_term)

    for t in similar_words:
        words['words'].append({"similarity": str(t[1]),
                               "similar_word": t[0],
                                "cardinality": str(t[2])})
    return words