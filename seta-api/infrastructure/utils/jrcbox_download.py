import requests
import os
from bs4 import BeautifulSoup
import hashlib as hash
import zipfile
import subprocess
import time
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
    print('waiting', flush=True)
    try:
        res = requests.get("http://" + config["ES_HOST"] + "/_cluster/health?pretty")
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
    print('seta_init', flush=True)
    if download_seta_file(config['ES_INIT_DATA_CONFIG_FILE'],config):
        es_session = requests.Session()
        es_session.trust_env = False
        headers = {"Content-Type": "application/json"}
        fn = config['MODELS_PATH'] + config['ES_INIT_DATA_CONFIG_FILE']
        f = open(fn,'r')
        dataformat = f.read()
        dataformat = json.loads(dataformat)
        dataformat = json.dumps(dataformat[config["INDEX"][0]])
        f.close()  
        print(config["INDEX"][0])
        print(dataformat)
        for indx in config["INDEX"]:
          resp = es_session.put("http://"+config["ES_HOST"]+"/"+indx+ "?pretty", data=dataformat, headers=headers)        
          if resp.ok:
            print("ElasticSearch index mapping. Done")
          else:
            print (resp.content)
    else:
        print("ES has index.")
    
    dump_file = config["ES_INIT_DATA_DUMP_FILE"]
    if download_seta_file(dump_file,config):
        models_path = config['MODELS_PATH']
        fn = ""
        if (dump_file[-4:] == ".zip"):
          with zipfile.ZipFile(models_path + dump_file, 'r') as zip_ref:
              zip_ref.extractall(models_path)
          fn = models_path + dump_file[:-4] + ".json"
        else:
          fn = models_path + dump_file
        ed_input = "--input=" + fn
        ed_output = "--output=http://" + config['"ES_HOST"']
        # elasticdump --input=../data/export10000.json --output=http://localhost:9200 --type=data
        subprocess.call(["elasticdump", ed_input, ed_output, "--type=data"])
        print("ES has been ingested.")
    else:
        print("ES has data.")

    if download_seta_file(config['MODELS_INIT_FILE'],config):
        models_path = config['MODELS_PATH']
        with zipfile.ZipFile(models_path + config['MODELS_INIT_FILE'], 'r') as zip_ref:
            zip_ref.extractall(models_path)

def download_seta_file(fl,config):

    session = requests.Session()
    session.trust_env = False
    
    BLOCKSIZE = 65536
    
    linkData = config['JRCBOX_ID']
    link = config['JRCBOX_PATH'] + linkData
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
        passwd = config['JRCBOX_PASS']
        paramsA = {'requesttoken': rq, 'password': passwd}
        print("JRCbox authenticating...")
        resp = session.post(linkA,params=paramsA)
        if resp.ok:
            print("downloading")

            p = fl.split('/')
            path = '/'.join(p[:-1]) if len(p)>1 else '/'
            fl = p[-1] if len(p)>0 else None
            
            crc = ""
            if os.path.exists(config['MODELS_PATH'] + fl + ".crc"):
                f = open(config['MODELS_PATH'] + fl+".crc",mode='r')
                crc = f.read()
                f.close()
            elif os.path.exists(config['MODELS_PATH'] + fl):
                crc = getsha256(config['MODELS_PATH'] + fl)
 
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

                resp = session.get(linkF,params=params,stream=True)
                if resp.ok:
                    f = open(config['MODELS_PATH'] + fl, 'wb')
                    done = 0
                    for chunk in resp.iter_content(chunk_size=65536): 
                        if chunk:
                            f.write(chunk)
                            done = done + len(chunk)
                            print(round(done/(1024*1024)), end=" Mb\r", flush=True)

                    print("\033[K",round(done/(1024*1024)), end=" Mb\n", flush=True)
                    f.close()
                    print("downloaded")

                    crc = getsha256(config['MODELS_PATH'] + fl)
                    f = open(config['MODELS_PATH'] + fl+".crc",mode='w')
                    f.write(crc)
                    f.close()
                    return True
            else:
                print("Data is up-to-date. No need to download.", fl)
    return False


