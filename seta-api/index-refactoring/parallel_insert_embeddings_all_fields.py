from sentence_transformers import SentenceTransformer
import infrastructure.utils.clean as clean
from elasticsearch import Elasticsearch, helpers
import yaml
import multiprocessing
from tqdm import *
from itertools import zip_longest
import json
from multiprocessing import set_start_method
import copy

from multiprocessing import get_context

config = yaml.load(open("../config.yaml"), Loader=yaml.FullLoader)
if config["env"] == "dev":
    es = Elasticsearch(config['es-host-dev'], http_auth=(config['user'], config['pass']), timeout=30)
else:
    es = Elasticsearch(config['es-host'], http_auth=(config['user'], config['pass']), timeout=30)

model = SentenceTransformer('all-distilroberta-v1')
model.max_seq_length = 512


def grouper(n, iterable, padvalue='\n'):
    return zip_longest(*[iter(iterable)] * n, fillvalue=padvalue)

def process_chunk(doc):
    try:
        doc = json.loads(doc)
        print(doc['_id'])
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
                text = doc['_source']["text"]
                if text is not None:
                    text_doc = text_doc + text
        cleaned_text = clean.sentenced(text_doc)
        words = cleaned_text.split(" ")
        high = 299
        embeddings = []
        c = 1
        for w in range(0, len(words), 300):
            ww = words[w:high]
            sent = " ".join([str(x) for x in ww])
            embedding = model.encode(sent, convert_to_numpy=True)
            embeddings.append({"vector": embedding.tolist(), "chunk": c})
            c += 1
            high += 300
        my_doc = doc["_source"]
        my_doc.pop("sbert_vector")
        my_doc["sbert_vectors"] = embeddings
        # print("to_idex: ", doc['_id'])
        response = es.index(index="seta-multi-embedding-000001", id=doc['_id'], document=my_doc)
        print(response)
    except:
        print("error in doc: ", doc['_id'])


def main():
    set_start_method("spawn")
    if config["env"] == "dev":
        p = multiprocessing.get_context("spawn").Pool(2)
    else:
        p = multiprocessing.get_context("spawn").Pool(2)
    CHUNK = 100
    for chunk in grouper(CHUNK, open('export-all.jsonl')):
        p.map(process_chunk, chunk)
    p.close()
    p.join()


if __name__ == '__main__':
    main()


