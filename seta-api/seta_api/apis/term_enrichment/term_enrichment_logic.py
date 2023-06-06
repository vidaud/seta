from ..similar.similar_logic import get_similar_words
from ..ontology.ontology_logic import build_tree


def perform_enrichment(terms, enrichment_type, current_app):
    response = {"words": []}
    if enrichment_type is None:
        enrichment_type = current_app.config["DEFAULT_ENRICHMENT_TYPE"]

    if enrichment_type == "similar":
        similar_words = set()
        for t in terms:
            similar_obj = get_similar_words(t, None, None, current_app)
            for s in similar_obj["words"]:
                similar_words.add(s["similar_word"])
        response["words"] = list(similar_words)
        return response

    if enrichment_type == "ontology":
        ontology_words = set()
        for t in terms:
            ontology_result = build_tree(t, None, current_app)
            for node in ontology_result["nodes"]:
                for word in node:
                    ontology_words.add(word)
        response["words"] = list(ontology_words)
        return response
    return response
