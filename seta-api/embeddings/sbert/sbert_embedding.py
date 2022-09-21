from sentence_transformers import SentenceTransformer
import clean
from elasticsearch import Elasticsearch, helpers
import yaml

model = SentenceTransformer('all-distilroberta-v1')
model.max_seq_length = 512

config = yaml.load(open("../../config.yaml"), Loader=yaml.FullLoader)

INDEX_NAME = config['index']
es = Elasticsearch(config['es-host'], http_auth=(config['user'], config['pass']))
# query = {"query": {"match_all": {}}, "_source": ["title", "text", "abstract"]}
query = {"query": {"bool": {"must_not": [{"exists": {"field": "sbert_vector"}}]}},
         "_source": ["title", "text", "abstract"]}
results = helpers.scan(es, query=query, index=INDEX_NAME, scroll=u'5m', size=100)

for doc in results:
    print(doc['_id'])
    try:
        text_doc = ''
        if "title" in doc['_source']:
            title = doc['_source']["title"]
            if title is not None:
                text_doc = title + "\n"
        if "abstract" in doc['_source']:
            if doc['_source']["abstract"]:
                abstract = doc['_source']["abstract"]
                if abstract is not None:
                    text_doc = text_doc + abstract + "\n"
        if "text" in doc['_source']:
            if doc['_source']["text"]:
                text = doc['_source']["text"][:5000]
                if text is not None:
                    text_doc = text_doc + text
        cleaned_text = clean.sentenced(text_doc)
        # print(cleaned_text)
        embeddings = model.encode([cleaned_text], convert_to_numpy=True)
        # print(embeddings[0].tolist())
        source_to_update = {
            "doc": {
                "sbert_vector": embeddings[0].tolist()
            }
        }
        response = es.update(index=INDEX_NAME, doc_type="_doc", id=doc['_id'], body=source_to_update)
        print(response)
    except:
        print("error in doc: " + doc['_id'])
