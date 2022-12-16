import time
import logging
from datetime import datetime
import shutil

from elasticsearch import Elasticsearch
#from sentence_transformers import SentenceTransformer
from gensim.models import KeyedVectors

from elasticsearch.helpers import bulk
import requests
import os
from tqdm import tqdm
import json

import config
config = config.ProdConfig()  


def wait_for_es(config):
    esh = "http://" + config.ES_HOST + "/_cluster/health?pretty"
    print('waiting for ES', esh, flush=True)
    try:
        es_session = requests.Session()
        es_session.trust_env = False
        res = es_session.get(esh)
        print(res,res.ok, flush=True)
        if res.ok:
            res = json.loads(res.content)
            print("ElsticSearch...", res['status'], flush=True)
            if res['status'] == 'green' or res['status'] == 'yellow':
                return
        time.sleep(2)
        wait_for_es(config)
    except Exception as e:
        time.sleep(2)
        wait_for_es(config)


def suggestion_update_job(config):
    models_path = config.MODELS_PATH
    if os.path.exists(models_path + config.MODELS_WORD2VEC_FILE_CRC):
        crc = open(models_path + config.MODELS_WORD2VEC_FILE_CRC, 'r').read()
    else:
        crc = getsha256(models_path + config.MODELS_WORD2VEC_FILE)
        f = open(models_path + config.MODELS_WORD2VEC_FILE_CRC,mode='w')
        f.write(crc)
        f.close()

    es_session = requests.Session()
#    es_session.trust_env = True
    
    index_suggestion = config.INDEX_SUGGESTION
    es = Elasticsearch("http://" + config.ES_HOST, verify_certs=False, request_timeout=30)
    resp = es_session.put("http://"+  config.ES_HOST + "/"+index_suggestion+ "?pretty")        
    print(resp)
    current_w2v_crc, crc_id = get_crc_from_es(es, index_suggestion)
    if crc != current_w2v_crc:
        try:
            bulk(es, gen_data(crc))
            crc_model = {"crc_model": crc}
            delete_all_suggestion(current_w2v_crc)
            if crc_id:
                es.update(index=index_suggestion, id=crc_id, doc=crc_model)
            else:
                es.index(index=index_suggestion, document=crc_model)
        except:
            print("errors on suggestion update. New crc: ", crc)
            
def gen_data(crc):
    print("suggestion indexing started")
    terms_model = KeyedVectors.load(config.MODELS_PATH + config.MODELS_WORD2VEC_FILE, mmap="r")
    for word in tqdm(list(terms_model.wv.vocab)):
        phrase = word.replace('_', ' ').lower()
        yield {
            "_index": config.INDEX_SUGGESTION,
            "phrase": phrase,
            "crc": crc
        } 
        
def delete_all_suggestion(crc):
    if crc:
        print("suggestion delete started")
        query = {"query": {"bool": {"must": [{"match": {"crc.keyword": crc}}]}}}
        es = Elasticsearch("http://" + config.ES_HOST, verify_certs=False, request_timeout=30)
        res = es.delete_by_query(index=config.INDEX_SUGGESTION, body=query, wait_for_completion=False)
        print(res)
        print("suggestion delete finished")


def seta_es_init_map(config):
        es_session = requests.Session()
#        es_session.trust_env = True
        headers = {"Content-Type": "application/json"}
        fn = config.MODELS_PATH + config.ES_INIT_DATA_CONFIG_FILE
        f = open(fn,'r')
        dataformat = f.read()
#        dataformat = json.loads(dataformat)
#        dataformat = json.dumps(dataformat[config["INDEX"][0]])
        f.close()  
#        print(config["INDEX"][0])
        print(dataformat)
        for indx in config.INDEX:
          resp = es_session.get("http://"+config.ES_HOST+"/"+indx+ "?pretty")
          if resp.ok:
            print("ElasticSearch index mapping exists: ",indx)
          else:
            resp = es_session.put("http://"+config.ES_HOST+"/"+indx+ "?pretty", data=dataformat, headers=headers)        
            print (resp.content)

def copy_models_files(config):
    dst = config.MODELS_PATH + config.ES_INIT_DATA_CONFIG_FILE
    src = config.MODELS_DOCKER_PATH + config.ES_INIT_DATA_CONFIG_FILE
    shutil.copyfile(src, dst)

    dst = config.MODELS_PATH + config.MODELS_WORD2VEC_FILE
    src = config.MODELS_DOCKER_PATH + config.MODELS_WORD2VEC_FILE
    shutil.copyfile(src, dst)

    dst = config.MODELS_PATH + config.MODELS_WORD2VEC_FILE + ".vectors.npy"
    src = config.MODELS_DOCKER_PATH + config.MODELS_WORD2VEC_FILE + ".vectors.npy"
    shutil.copyfile(src, dst)

    dst = config.MODELS_PATH + config.MODELS_WORD2VEC_FILE_CRC
    src = config.MODELS_DOCKER_PATH + config.MODELS_WORD2VEC_FILE_CRC
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
    wait_for_es(config)
    copy_models_files(config)
    suggestion_update_job(config)
    seta_es_init_map(config)    
    print("SeTA-ES is initialised.")


init()
