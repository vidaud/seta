import json
import os
import shutil
import time
import config
import requests
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

import hashlib as hash
from config import Config as DevConfig, TestConfig

app_env = os.environ.get('APP_ENV')

if app_env is not None and app_env.lower() == "test":
    config = TestConfig()
else:
    config = DevConfig()


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
    esh = f"http://{config.ES_HOST}/_cluster/health?pretty"
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
        wait_for_es()
    except Exception as e:
        time.sleep(2)
        wait_for_es()


def suggestion_update_job():
    try:
        models_path = config.MODELS_PATH
        if os.path.exists(models_path + config.WORD2VEC_JSON_EXPORT_CRC):
            crc = open(models_path + config.WORD2VEC_JSON_EXPORT_CRC, 'r').read()
        else:
            crc = getsha256(models_path + config.WORD2VEC_JSON_EXPORT)
            f = open(models_path + config.WORD2VEC_JSON_EXPORT_CRC, mode='w')
            f.write(crc)
            f.close()

        index_suggestion = config.INDEX_SUGGESTION
        es = Elasticsearch("http://" + config.ES_HOST, verify_certs=False, request_timeout=300, max_retries=10,
                           retry_on_timeout=True)
        print(es)

        current_w2v_crc, crc_id = get_crc_from_es(es, index_suggestion, "crc_model")
        if crc != current_w2v_crc:
            try:
                print("starting suggestion upload", flush=True)
                bulk(es, gen_data(crc), request_timeout=300)
                crc_model = {"crc_model": crc}

                if current_w2v_crc:
                    print("deleting old suggestions", flush=True)
                    delete_all_suggestion(current_w2v_crc)

                if crc_id:
                    print("updating suggestions id", flush=True)
                    es.update(index=index_suggestion, id=crc_id, doc=crc_model)
                else:
                    print("adding suggestions id", flush=True)
                    es.index(index=index_suggestion, document=crc_model)
            except Exception as e:
                print("errors on suggestion update. New crc: ", crc, flush=True)
                print(str(e), flush=True)

    except Exception as ex:
        print("errors on suggestion update: ")
        print(str(ex), flush=True)


def gen_data(crc):
    print("suggestions indexing started", flush=True)

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
        print("suggestion delete started", flush=True)
        query = {"bool": {"must": [{"match": {"crc.keyword": crc}}]}}
        es = Elasticsearch("http://" + config.ES_HOST, verify_certs=False, request_timeout=300)
        res = es.delete_by_query(index=config.INDEX_SUGGESTION, query=query, wait_for_completion=False)
        print(res, flush=True)
        print("suggestion deleted", flush=True)


def seta_es_init_map():
    es_session = requests.Session()
    mapping_file = config.MODELS_PATH + config.ES_INIT_DATA_CONFIG_FILE
    mapping_crc_file = config.MODELS_PATH + config.CRC_ES_INIT_DATA_CONFIG_FILE
    for index in config.INDEX:
        check_index_exists_or_create_it(config.ES_HOST, mapping_file, mapping_crc_file, es_session, index)
    # suggestion index
    mapping_file_suggestion = config.MODELS_PATH + config.ES_SUGGESTION_INIT_DATA_CONFIG_FILE
    mapping_crc_file_suggestion = config.MODELS_PATH + config.CRC_ES_SUGGESTION_INIT_DATA_CONFIG_FILE
    check_index_exists_or_create_it(config.ES_HOST, mapping_file_suggestion, mapping_crc_file_suggestion, es_session,
                                    config.INDEX_SUGGESTION)


def verify_data_mapping(host, index, es_session, data_format, headers, mapping_crc_file):
    # every time data mapping is changed index is deleted and recreate
    es = Elasticsearch("http://" + host, verify_certs=False, request_timeout=300, max_retries=10,
                       retry_on_timeout=True)

    crc = open(mapping_crc_file, 'r').read()

    crc_value, crc_id = get_crc_from_es(es, index, "crc_data_mapping")

    if crc != crc_value:
        print("New mapping found!", flush=True)
        print("mapping update started", flush=True)
        crc_mapping = {"crc_data_mapping": crc}

        print("delete and recreate index: ", index, flush=True)
        delete_index(host, es_session, index)
        create_index(es_session, host, index, data_format, headers)

        print("adding crc mapping document", flush=True)
        es.index(index=index, document=crc_mapping)


def create_index(es_session, host, index, data_format, headers):
    resp = es_session.put("http://" + host + "/" + index + "?pretty", data=data_format, headers=headers)
    print(resp.content, flush=True)


def check_index_exists_or_create_it(host, mapping_file, mapping_crc_file, es_session, index):
    headers = {"Content-Type": "application/json"}
    f = open(mapping_file, 'r')
    data_format = f.read()
    f.close()
    resp = es_session.get("http://" + host + "/" + index + "?pretty")
    if resp.ok:
        print("ElasticSearch index mapping exists: ", index, flush=True)
        verify_data_mapping(host, index, es_session, data_format, headers, mapping_crc_file)
    else:
        create_index(es_session, host, index, data_format, headers)


def delete_index(host, es_session, index):
    resp = es_session.delete("http://" + host + "/" + index + "?pretty")
    print(resp.content, flush=True)


def copy_models_files():
    dst = config.MODELS_PATH + config.ES_INIT_DATA_CONFIG_FILE
    src = config.MODELS_DOCKER_PATH + config.ES_INIT_DATA_CONFIG_FILE
    shutil.copyfile(src, dst)

    dst = config.MODELS_PATH + config.WORD2VEC_JSON_EXPORT
    src = config.MODELS_DOCKER_PATH + config.WORD2VEC_JSON_EXPORT
    shutil.copyfile(src, dst)

    dst = config.MODELS_PATH + config.WORD2VEC_JSON_EXPORT_CRC
    src = config.MODELS_DOCKER_PATH + config.WORD2VEC_JSON_EXPORT_CRC

    # file WORD2VEC_JSON_EXPORT_CRC will be generated in suggestion_update_job()
    if os.path.exists(src):
        shutil.copyfile(src, dst)

    dst = config.MODELS_PATH + config.ES_SUGGESTION_INIT_DATA_CONFIG_FILE
    src = config.MODELS_DOCKER_PATH + config.ES_SUGGESTION_INIT_DATA_CONFIG_FILE
    shutil.copyfile(src, dst)


def get_crc_from_es(es, index, crc_field):
    query = {"bool": {"must": [{"exists": {"field": crc_field}}]}}
    resp = es.search(index=index, query=query)
    if resp['hits']['total']['value'] == 0:
        crc_value = None
        crc_id = None
    else:
        crc_value = resp['hits']['hits'][0]['_source'][crc_field]
        crc_id = resp['hits']['hits'][0]['_id']
    return crc_value, crc_id


def init():
    wait_for_es()
    print("copy model files", flush=True)
    copy_models_files()
    print("seta es init map", flush=True)
    seta_es_init_map()
    print("seta suggestions init/update", flush=True)
    suggestion_update_job()
    print("SeTA-ES is initialised.", flush=True)


if __name__ == "__main__":
    init()
