import json

from elasticsearch import Elasticsearch, helpers
from tqdm import *
import yaml
config = yaml.load(open("../config.yaml"), Loader=yaml.FullLoader)

INDEX_NAME = "seta-embedding-000005"

if config["env"] == "dev":
    es = Elasticsearch(config['es-host-dev'], http_auth=(config['user'], config['pass']), timeout=60)
else:
    es = Elasticsearch(config['es-host'], http_auth=(config['user'], config['pass']), timeout=60)


query = {"match_all": {}}
q = es.search(index=INDEX_NAME, query=query)
fo = open('export-1000.jsonl', 'w', encoding='utf-8')

results = helpers.scan(es, query=query, index=INDEX_NAME, scroll=u'5m', size=100)
n = 0
for w in tqdm(results, total=590000):
    if n == 1000:
        break
    fo.write(json.dumps(w) + '\n')
    n +=1

