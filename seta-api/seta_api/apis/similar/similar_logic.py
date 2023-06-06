from seta_api.infrastructure.utils.w2v_elasticsearch import word_exists, get_most_similar_with_score_and_size


def get_similar_words(term, terms, n_term, current_app):
    if n_term is None:
        n_term = current_app.config["DEFAULT_TERM_NUMBER"]
    words = {'words': []}
    if term:
        if not word_exists(current_app, term):
            return words

        similar_words = get_most_similar_with_score_and_size(term, current_app, n_term)

        for t in similar_words:
            words['words'].append({"similarity": str(t[1]),
                                   "similar_word": t[0],
                                   "cardinality": str(t[2])})
    if terms:
        if len(terms) == 0:
            return words
        if len(terms) == 1:
            t = terms[0]
            if not word_exists(current_app, t):
                return words

            similar_words = get_most_similar_with_score_and_size(t, current_app, n_term)

            for t in similar_words:
                words['words'].append({"similarity": str(t[1]),
                                       "similar_word": t[0],
                                       "cardinality": str(t[2])})
        if len(terms) > 1:
            similar = set()
            for t in terms:
                if not word_exists(current_app, t):
                    continue
                similar_words = get_most_similar_with_score_and_size(t, current_app, n_term)
                for s in similar_words:
                    if s[0] in terms:
                        continue
                    similar.add((s[0], s[2]))
            for t in similar:
                words['words'].append({"similarity": str(0.0),
                                       "similar_word": t[0],
                                       "cardinality": str(t[1])})

    return words
