import time
import shutil

from elasticsearch import Elasticsearch
#from sentence_transformers import SentenceTransformer
from gensim.models import KeyedVectors

from elasticsearch.helpers import bulk
import requests
import os
from tqdm import tqdm
import json

import hashlib as hash

from config import Config

def getsha256(filename):
    BLOCKSIZE = 65536
    sha = hash.sha256()
    with open(filename, 'rb') as f:
        file_buffer = f.read(BLOCKSIZE)
        while len(file_buffer) > 0:
            sha.update(file_buffer)
            file_buffer = f.read(BLOCKSIZE)
    return sha.hexdigest()


def wait_for_es():
    esh = f"http://{Config.ES_HOST}/_cluster/health?pretty"
    print('waiting for ES', esh, flush=True)
    try:
        es_session = requests.Session()
        es_session.trust_env = False
        res = es_session.get(esh)
        print(res,res.ok, flush=True)
        if res.ok:
            res = json.loads(res.content)
            print("ElasticSearch...", res['status'], flush=True)
            if res['status'] == 'green' or res['status'] == 'yellow':
                return
        time.sleep(2)
        wait_for_es()
    except Exception as e:
        time.sleep(2)
        wait_for_es()


def suggestion_update_job():
    models_path = Config.MODELS_PATH
    if os.path.exists(models_path + Config.MODELS_WORD2VEC_FILE_CRC):
        crc = open(models_path + Config.MODELS_WORD2VEC_FILE_CRC, 'r').read()
    else:
        crc = getsha256(models_path + Config.MODELS_WORD2VEC_FILE)
        f = open(models_path + Config.MODELS_WORD2VEC_FILE_CRC,mode='w')
        f.write(crc)
        f.close()

    es_session = requests.Session()
#    es_session.trust_env = True
    
    index_suggestion = Config.INDEX_SUGGESTION
    es = Elasticsearch("http://" + Config.ES_HOST, verify_certs=False, request_timeout=30)
    resp = es_session.put(f"http://{Config.ES_HOST}/{index_suggestion}?pretty")      
      
    print(resp)
    
    current_w2v_crc, crc_id = get_crc_from_es(es, index_suggestion)
    if crc != current_w2v_crc:
        try:
            bulk(es, gen_data(crc))
            crc_model = {"crc_model": crc}
            
            if current_w2v_crc:
                delete_all_suggestion(current_w2v_crc)
                
            if crc_id:
                es.update(index=index_suggestion, id=crc_id, doc=crc_model)
            else:
                es.index(index=index_suggestion, document=crc_model)
        except Exception as e:            
            print("errors on suggestion update. New crc: ", crc)
            print(e)
            
def gen_data(crc):
    print("suggestion indexing started")
    
    terms_model = KeyedVectors.load(Config.MODELS_PATH + Config.MODELS_WORD2VEC_FILE, mmap="r")
    for word in tqdm(list(terms_model.wv.vocab)):
        phrase = word.replace('_', ' ').lower()
        yield {
            "_index": Config.INDEX_SUGGESTION,
            "phrase": phrase,
            "crc": crc
        } 
        
def delete_all_suggestion(crc):    
    print("suggestion delete started")
    
    query = {"query": {"bool": {"must": [{"match": {"crc.keyword": crc}}]}}}
    es = Elasticsearch("http://" + Config.ES_HOST, verify_certs=False, request_timeout=30)
    res = es.delete_by_query(index=Config.INDEX_SUGGESTION, body=query, wait_for_completion=False)
    
    print(res)
    print("suggestion delete finished")


def seta_es_init_map():
    es_session = requests.Session()
#        es_session.trust_env = True
    headers = {"Content-Type": "application/json"}
    fn = Config.MODELS_PATH + Config.ES_INIT_DATA_CONFIG_FILE
    
    f = open(fn,'r')
    dataformat = f.read()    
    f.close()  
    
    print(dataformat)
    for indx in Config.INDEX:
        resp = es_session.get(f"http://{Config.ES_HOST}/{indx}?pretty")
        if resp.ok:
            print("ElasticSearch index mapping exists: ",indx)
        else:
            resp = es_session.put(f"http://{Config.ES_HOST}/{indx}?pretty", data=dataformat, headers=headers)        
            print (resp.content)

def copy_models_files():
    dst = Config.MODELS_PATH + Config.ES_INIT_DATA_CONFIG_FILE
    src = Config.MODELS_DOCKER_PATH + Config.ES_INIT_DATA_CONFIG_FILE
    shutil.copyfile(src, dst)

    dst = Config.MODELS_PATH + Config.MODELS_WORD2VEC_FILE
    src = Config.MODELS_DOCKER_PATH + Config.MODELS_WORD2VEC_FILE
    shutil.copyfile(src, dst)

    dst = Config.MODELS_PATH + Config.MODELS_WORD2VEC_FILE + ".vectors.npy"
    src = Config.MODELS_DOCKER_PATH + Config.MODELS_WORD2VEC_FILE + ".vectors.npy"
    shutil.copyfile(src, dst)

    dst = Config.MODELS_PATH + Config.MODELS_WORD2VEC_FILE_CRC
    src = Config.MODELS_DOCKER_PATH + Config.MODELS_WORD2VEC_FILE_CRC
    shutil.copyfile(src, dst)

def get_crc_from_es(es, index_suggestion):
    query = {"bool": {"must": [{"exists": {"field": "crc_model"}}]}}
    resp = es.search(index=index_suggestion, query=query)
    if resp['hits']['total']['value'] == 0:
        crc_es = None
        crc_id = None
    else:
        crc_es = resp['hits']['hits'][0]['_source']['crc_model']
        crc_id = resp['hits']['hits'][0]['_id']
    return crc_es, crc_id


           
def init():
    wait_for_es()
    copy_models_files()
    suggestion_update_job()
    seta_es_init_map()    
    print("SeTA-ES is initialised.")

 
if __name__ == "__main__":
    init()
