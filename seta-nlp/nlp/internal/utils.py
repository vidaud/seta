from textacy import preprocessing


def sentenced(text):
    """Normalize text."""

    proc_pipeline = preprocessing.make_pipeline(
        preprocessing.normalize.unicode,
        preprocessing.normalize.whitespace,
        preprocessing.remove.accents,
        preprocessing.replace.urls,
        preprocessing.replace.emails,
        preprocessing.replace.phone_numbers,
    )

    return proc_pipeline(text)
