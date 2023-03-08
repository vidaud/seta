import json
import os
import shutil
import time
import config
import requests
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

import hashlib as hash
BLOCKSIZE = 65536

config = config.ProdConfig()


def wait_for_es(config):
    esh = "http://" + config.ES_HOST + "/_cluster/health?pretty"
    print('waiting for ES', esh, flush=True)
    try:
        es_session = requests.Session()
        es_session.trust_env = False
        res = es_session.get(esh)
        print(res, res.ok, flush=True)
        if res.ok:
            res = json.loads(res.content)
            print("ElasticSearch...", res['status'], flush=True)
            if res['status'] == 'green' or res['status'] == 'yellow':
                return
        time.sleep(2)
        wait_for_es(config)
    except Exception as e:
        time.sleep(2)
        wait_for_es(config)


def suggestion_update_job(config):
    models_path = config.MODELS_PATH
    if os.path.exists(models_path + config.WORD2VEC_JSON_EXPORT_CRC):
        crc = open(models_path + config.WORD2VEC_JSON_EXPORT_CRC, 'r').read()
    else:
        crc = getsha256(models_path + config.WORD2VEC_JSON_EXPORT)
        f = open(models_path + config.WORD2VEC_JSON_EXPORT_CRC, mode='w')
        f.write(crc)
        f.close()

    index_suggestion = config.INDEX_SUGGESTION
    es = Elasticsearch("http://" + config.ES_HOST, verify_certs=False, request_timeout=30)
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
        except Exception as e:
            print(e)
            print("errors on suggestion update. New crc: ", crc)


def gen_data(crc):
    print("suggestion indexing started")

    with open(config.MODELS_PATH + config.WORD2VEC_JSON_EXPORT) as json_file:
        data = json.load(json_file)

    for suggestion in data:
        yield {
                "_index": config.INDEX_SUGGESTION,
                "phrase": suggestion["phrase"],
                "most_similar": suggestion["most_similar"],
                "size": suggestion["size"],
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
    headers = {"Content-Type": "application/json"}
    fn = config.MODELS_PATH + config.ES_INIT_DATA_CONFIG_FILE
    f = open(fn, 'r')
    data_format = f.read()
    f.close()
    for indx in config.INDEX:
        check_index_exists_or_create_it(config.ES_HOST, data_format, es_session, headers, indx)
    #suggestion index
    fn = config.MODELS_PATH + config.ES_SUGGESTION_INIT_DATA_CONFIG_FILE
    f = open(fn, 'r')
    data_format = f.read()
    f.close()
    check_index_exists_or_create_it(config.ES_HOST, data_format, es_session, headers, config.INDEX_SUGGESTION)


def check_index_exists_or_create_it(host, dataformat, es_session, headers, indx):
    resp = es_session.get("http://" + host + "/" + indx + "?pretty")
    if resp.ok:
        print("ElasticSearch index mapping exists: ", indx)
    else:
        resp = es_session.put("http://" + host + "/" + indx + "?pretty", data=dataformat, headers=headers)
        print(resp.content)


def copy_models_files(config):
    dst = config.MODELS_PATH + config.ES_INIT_DATA_CONFIG_FILE
    src = config.MODELS_DOCKER_PATH + config.ES_INIT_DATA_CONFIG_FILE
    shutil.copyfile(src, dst)

    dst = config.MODELS_PATH + config.WORD2VEC_JSON_EXPORT
    src = config.MODELS_DOCKER_PATH + config.WORD2VEC_JSON_EXPORT
    shutil.copyfile(src, dst)

    dst = config.MODELS_PATH + config.WORD2VEC_JSON_EXPORT_CRC
    src = config.MODELS_DOCKER_PATH + config.WORD2VEC_JSON_EXPORT_CRC
    shutil.copyfile(src, dst)

    dst = config.MODELS_PATH + config.ES_SUGGESTION_INIT_DATA_CONFIG_FILE
    src = config.MODELS_DOCKER_PATH + config.ES_SUGGESTION_INIT_DATA_CONFIG_FILE
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


def getsha256(filename):
    sha = hash.sha256()
    with open(filename, 'rb') as f:
        file_buffer = f.read(BLOCKSIZE)
        while len(file_buffer) > 0:
            sha.update(file_buffer)
            file_buffer = f.read(BLOCKSIZE)
    return sha.hexdigest()


def init():
    wait_for_es(config)
    copy_models_files(config)
    seta_es_init_map(config)
    suggestion_update_job(config)
    print("SeTA-ES is initialised.")


init()
