from infrastructure.helpers import sanitize_input, word_exists
from infrastructure.ApiLogicError import ApiLogicError

def semantic_distance(w1, w2, current_app):
    w1 = sanitize_input(w1)
    w2 = sanitize_input(w2)

    if not word_exists(current_app.terms_model, w1):
        raise ApiLogicError('Term 1 out of vocabulary.')

    if not word_exists(current_app.terms_model, w2):
        raise ApiLogicError('Term 2 out of vocabulary.')

    return {'distance': current_app.terms_model.wv.distance(w1, w2)}    