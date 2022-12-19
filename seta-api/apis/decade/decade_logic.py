import json

def build_decade_graph(word, current_app):
    query = {
        "_source": "date",
        "size": 0,
        "aggs": {
            "years": {
                "date_histogram": {"field": "date", 
                          "calendar_interval": "year",
                          "format": "yyyy" 
                         }
                     }
               },
        "query": {
            "bool": {
                "must": {"multi_match": {
                    "query": word.replace('_', ' '),
                    "type": "phrase",
                    "fields": ["title^10", "opening-text^3", "chunk_text", "abstract"]
                }
                },
                "filter": {"match": {"source": "bookshop OR eurlex OR cordis OR pubsy OR opendataportal"}}
            }
        }
    }
    search_arr = []
    search_arr.append({'index': current_app.config["INDEX"]})
    search_arr.append(query)
    request = ''

    for each in search_arr:
        request += '%s \n' % json.dumps(each)
    res = current_app.es.msearch(searches=request)
    a = {}
    
    for r in res["responses"]:
        for k in r["aggregations"]["years"]["buckets"]:
            year = int(k['key_as_string']) # // 5 * 5
            if year not in a: a[year] = 0
            a[year] += k['doc_count']
            
    print('conteggio years....:', a)
    x = sorted(  [ str(w) for w in list(a)]  )
    print('sorted x....:', x)

    y = [a[w] for w in sorted(list(a))]
    print('sorted y....:', y)

    decade = {'graph': [{'years': a, 'x': x, 'y': y}]}
    return decade
