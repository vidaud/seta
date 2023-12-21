def sanitize_input(word):
    return word.replace(' ', '_').lower()


def revert_sanitize_input(word):
    return word.replace('_', ' ').lower()


def is_field_in_doc(source, field):
    if field in source:
        return source[field]
    else:
        if field == "other":
            return {}
        if field == "chunk_text":
            return ""
        return None