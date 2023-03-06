from gensim.models import KeyedVectors
import json
import config
from operator import itemgetter

config = config.ProdConfig()

terms_model = KeyedVectors.load(config.MODELS_PATH + config.MODELS_WORD2VEC_FILE, mmap="r")

suggestions = []


def get_similar_term_with_threshold(source_word):
    threshold = 0.7
    top_n = 20
    while True:
        terms = terms_model.most_similar(positive=[source_word], topn=top_n)
        min_score = min(terms, key=itemgetter(1))[1]
        if min_score < threshold:
            break
        else:
            top_n += 10
    return terms


for word in list(terms_model.vocab):
    phrase = word.replace('_', ' ').lower()
    most_similar = []

    similar_terms = get_similar_term_with_threshold(word)

    size = terms_model.vocab[word].count
    for entry in similar_terms:
        term = entry[0].replace('_', ' ').lower()
        size_t = terms_model.vocab[entry[0]].count
        most_similar.append({"term": term, "score": entry[1], "size": size_t})
    suggestion ={
    "phrase": phrase,
    "most_similar": most_similar,
    "size": size}
    suggestions.append(suggestion)

json_string = json.dumps(suggestions)
with open(config.MODELS_PATH + config.WORD2VEC_JSON_EXPORT, 'w') as outfile:
    outfile.write(json_string)



