def sanitize_input(word):
    return word.replace(' ', '_').lower()


def revert_sanitize_input(word):
    return word.replace('_', ' ').lower()


def word_exists(terms_model, path):
    path = sanitize_input(path)
    try:
        terms_model.wv.vocab[path]
        return True
    except:
        return False


def is_field_in_doc(source, field):
    if field in source:
        return source[field]
    else:
        return None    