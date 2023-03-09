from seta_api.infrastructure.utils.crc import get_crc_from_es

def get_word_suggestions(current_app, chars, n_suggestions=6):
    current_crc, crc_id = get_crc_from_es(current_app.es, current_app.config["INDEX_SUGGESTION"])

    chars = chars.replace('"', '').lower()
    query_suggestion = {"bool": {"must": [{"prefix": {"phrase.keyword": {"value": chars}}},
                                                    {"match": {"crc.keyword": current_crc}}]}}
    
    resp = current_app.es.search(index=current_app.config["INDEX_SUGGESTION"], query=query_suggestion, size=n_suggestions)

    suggestions = []
    for sugg in resp["hits"]["hits"]:
        suggestions.append(sugg["_source"]["phrase"])
        
    return suggestions