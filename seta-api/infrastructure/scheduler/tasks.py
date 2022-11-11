from infrastructure.extensions import scheduler
from infrastructure.utils.jrcbox_download import wait_for_es
from infrastructure.utils.crc import get_crc_from_es, getsha256
from elasticsearch.helpers import bulk
import requests
import os
from tqdm import tqdm
from flask import current_app as app

@scheduler.task('cron', id='suggestion_update_job', hour=4, minute=00)
def suggestion_update_job():
    wait_for_es(app.config)
    
    models_path = app.models_path
    if os.path.exists(models_path + app.config['MODELS_WORD2VEC_FILE_CRC']):
        crc = open(models_path + app.config['MODELS_WORD2VEC_FILE_CRC'], 'r').read()
    else:
        crc = getsha256(models_path + app.config['MODELS_WORD2VEC_FILE'])
        f = open(models_path + app.config['mMODELS_WORD2VEC_FILE_CRC'],mode='w')
        f.write(crc)
        f.close()

    es_session = requests.Session()
    es_session.trust_env = False
    
    index_suggestion = app.config["INDEX_SUGGESTION"]
    resp = es_session.put("http://"+  app.config['ES_HOST'] + "/"+index_suggestion+ "?pretty")        
    app.logger.debug(resp)
    current_w2v_crc, crc_id = get_crc_from_es(app.es, index_suggestion)
    if crc != current_w2v_crc:
        try:
            bulk(app.es, gen_data(crc))
            crc_model = {"crc_model": crc}
            delete_all_suggestion(current_w2v_crc)
            if crc_id:
                app.es.update(index=index_suggestion, id=crc_id, doc=crc_model)
            else:
                app.es.index(index=index_suggestion, document=crc_model)
        except:
            print("errors on suggestion update. New crc: ", crc)
            
def gen_data(crc):
    print("suggestion indexing started")
    for word in tqdm(list(app.terms_model.wv.vocab)):
        phrase = word.replace('_', ' ').lower()
        yield {
            "_index": app.config["INDEX_SUGGESTION"],
            "phrase": phrase,
            "crc": crc
        } 
        
def delete_all_suggestion(crc):
    if crc:
        print("suggestion delete started")
        query = {"query": {"bool": {"must": [{"match": {"crc.keyword": crc}}]}}}
        res = app.es.delete_by_query(index=app.config["INDEX_SUGGESTION"], body=query, wait_for_completion=False)
        app.logger.debug(res)
        app.logger.debug("suggestion delete finished")