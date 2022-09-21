import requests
import os
import pathlib
from bs4 import BeautifulSoup
import hashlib as hash
import yaml
#import pkg_resources
#pkg_resources.require("gensim==3.8.0")
from gensim.models import KeyedVectors
from tqdm import tqdm
#import itertools
import zipfile
import subprocess
import pymongo
import time
from elasticsearch import Elasticsearch
import json


#config = ""

def getsha256(filename):
    BLOCKSIZE = 65536
    sha = hash.sha256()
    with open(filename, 'rb') as f:
        file_buffer = f.read(BLOCKSIZE)
        while len(file_buffer) > 0:
            sha.update(file_buffer)
            file_buffer = f.read(BLOCKSIZE)
    return sha.hexdigest()


def wait_for_es(config):
    try:
        res = requests.get("http://" + config['es-host'] + "/_cluster/health?pretty")
        if res.ok:
            res = json.loads(res.content)
            print("ElsticSearch...", res['status'])
            if res['status'] == 'green' or res['status'] == 'yellow':
                return
        time.sleep(1)
        wait_for_es(config)
    except Exception as e:
        time.sleep(1)
        wait_for_es(config)


def seta_init(config):
    wait_for_es(config)

    if download_seta_file(config['es-init-data-config-file'],config):
        es_session = requests.Session()
        es_session.trust_env = False
        headers = {"Content-Type": "application/json"}
        fn = config['models-path'] + config['es-init-data-config-file']
        f = open(fn,'r')
        dataformat = f.read()
        dataformat = json.loads(dataformat)
        dataformat = json.dumps(dataformat[config['index'][0]])
        f.close()
#        print (fn, dataformat)
#        resp = es_session.put("http://"+config['es-host']+"/"+config['index'][0]+ "?pretty", data=dataformat, headers=headers)        
#        resp = es_session.put("http://"+config['es-host']+"/"+ "?pretty", data=dataformat, headers=headers)        
        print(config['index'][0])
        print(dataformat)
        for indx in config['index']:
          resp = es_session.put("http://"+config['es-host']+"/"+indx+ "?pretty", data=dataformat, headers=headers)        
          if resp.ok:
            print("ElasticSearch index mapping. Done")
          else:
            print (resp.content)
    else:
        print("ES has index.")
        
    if download_seta_file(config['es-init-data-dump-file'],config):
        models_path = config['models-path']
        fn = ""
        if (config["es-init-data-dump-file"][-4:] == ".zip"):
          with zipfile.ZipFile(models_path + config['es-init-data-dump-file'], 'r') as zip_ref:
              zip_ref.extractall(models_path)
          fn = models_path + config["es-init-data-dump-file"][:-4] + ".json"
        else:
          fn = models_path + config["es-init-data-dump-file"]
        ed_input = "--input=" + fn
        ed_output = "--output=http://" + config['es-host']
        # elasticdump --input=../data/export10000.json --output=http://localhost:9200 --type=data
        subprocess.call(["elasticdump", ed_input, ed_output, "--type=data"])
        print("ES has been ingested.")
    else:
        print("ES has data.")

#    if download_seta_file(config['es-update-data-dump-file'],config):
#        models_path = config['models-path']
#        with zipfile.ZipFile(models_path + config['es-update-data-dump-file'], 'r') as zip_ref:
#            zip_ref.extractall(models_path)
#        fn = models_path + config["es-update-data-dump-file"][:-4] + ".json"
#        ed_input = "--input=" + fn
#        ed_output = "--output=" + config['es-host']
#        # elasticdump --input=../data/export10000.json --output=http://localhost:9200 --type=data
#        subprocess.call(["elasticdump", ed_input, ed_output, "--type=data"])
#        print("ES has ingested.")
#    else:
#        print("ES has data.")

    if download_seta_file(config['models-init-file'],config):
        models_path = config['models-path']
        with zipfile.ZipFile(models_path + config['models-init-file'], 'r') as zip_ref:
            zip_ref.extractall(models_path)


    myclient = pymongo.MongoClient(config['mongodb-host'])
    mydb = myclient["seta"]
    # Create database
    if "seta" not in myclient.list_database_names():
        # Create collections
        collectionNames = mydb.list_collection_names()
        collections = [ 'archive', 'logs', 'users']
        for name in collections:
            if name not in collectionNames:
                mydict = { "test": "test" }
                mydb[name].insert_one(mydict)
    print("Mongo data is ready.")

def download_seta_file(fl,config):

    session = requests.Session()
    session.trust_env = False
    
    BLOCKSIZE = 65536
    
    linkData = config['jrcbox-id']
    link = config['jrcbox-path'] + linkData
    resp = session.get(link, timeout=30)
    print("Downloading...", fl,resp)
    if resp.ok:
        rq = ""
        soup = BeautifulSoup(resp.content,features="lxml")
        for n in soup.findAll('input'):
            if n['name'] == "requesttoken":
                rq = n['value'] 
                break
        linkA = link + "/authenticate"
        passwd = config['jrcbox-pass']
        paramsA = {'requesttoken': rq, 'password': passwd}
        print("JRCbox authenticating...")
        resp = session.post(linkA,params=paramsA)
        if resp.ok:
            print("downloading")
#            now = time.time()
#            auth64 = (base64.b64encode((linkData + ":null").encode('utf-8'))).decode('utf-8')
#            headers = {'Authorization':'Basic ' + auth64}
#            r = session.request('PROPFIND',config['jrcbox-webdav'], headers=headers)
#            soup = BeautifulSoup(r.content,"xml")
#            for xp in soup.findAll('response'):
#                later = time.time()
#                if (int(later - now)) > 60:
#                    resp = session.post(linkA,params=paramsA)
#                    now = later
    
#            p = (xp.href.string.split('/')[3:])
            p = fl.split('/')
            path = '/'.join(p[:-1]) if len(p)>1 else '/'
            fl = p[-1] if len(p)>0 else None
#                   if fl:
            crc = ""
            if os.path.exists(config['models-path'] + fl + ".crc"):
                f = open(config['models-path'] + fl+".crc",mode='r')
                crc = f.read()
                f.close()
            elif os.path.exists(config['models-path'] + fl):
                crc = getsha256(config['models-path'] + fl)
 
            crc2 = ""
            params = {'path': path, 'files': fl+".crc"}
            linkF = link + '/download'
            resp = session.get(linkF,params=params,stream=False)
            if resp.ok:
                crc2 = resp.content.decode("utf-8") 

            params = {'path': path, 'files': fl}
            print(linkF,params)
            print(crc)
            print(crc2)
            if crc != crc2 or crc == "":
#                size = (int(xp.propstat.prop.getcontentlength.string))/(1024*1024)
                resp = session.get(linkF,params=params,stream=True)
                if resp.ok:
                    f = open(config['models-path'] + fl, 'wb')
                    done = 0
                    for chunk in resp.iter_content(chunk_size=65536): 
                        if chunk:
                            f.write(chunk)
                            done = done + len(chunk)
                            print(round(done/(1024*1024)), end=" Mb\r", flush=True)
#                            print(round(done/(1024*1024)),"/",round(size), end=" Mb\r", flush=True)
                    print("\033[K",round(done/(1024*1024)), end=" Mb\n", flush=True)
                    f.close()
                    print("downloaded")
#                    if not os.path.exists(config['models-path'] + fl+".crc"):
                    crc = getsha256(config['models-path'] + fl)
                    f = open(config['models-path'] + fl+".crc",mode='w')
                    f.write(crc)
                    f.close()
                    return True
            else:
                print("Data is up-to-date. No need to download.", fl)
    return False


