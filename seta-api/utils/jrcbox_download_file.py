import requests
import os
import pathlib
from bs4 import BeautifulSoup
import hashlib as hash
#import itertools
import zipfile



jrcbox_id = "6A5WOACv3JNXPaD"                                         # shared link suffix
jrcbox_path = "https://jrcbox.jrc.ec.europa.eu/index.php/s/"          # shared link prefix # your don't need to change it
jrcbox_pass = "Op-next-seta-2022-14-14"                               # shared link password
models_path = "data/"                            # full path where downloaded files will be stored

# specific files to download:
es_init_data_dump_file = "dump10000.zip"
es_init_data_config_file = "mapping.json"
models_init_file = "models.zip"


def getsha256(filename):
    BLOCKSIZE = 65536
    sha = hash.sha256()
    with open(filename, 'rb') as f:
        file_buffer = f.read(BLOCKSIZE)
        while len(file_buffer) > 0:
            sha.update(file_buffer)
            file_buffer = f.read(BLOCKSIZE)
    return sha.hexdigest()


def seta_init():
    download_seta_file(es_init_data_config_file)
        
    if download_seta_file(es_init_data_dump_file):
        with zipfile.ZipFile(models_path + es_init_data_dump_file, 'r') as zip_ref:
            zip_ref.extractall(models_path)
    else:
        print("ES has data.")
    download_seta_file(models_init_file)


def download_seta_file(fl):

    session = requests.Session()
    session.trust_env = False
    BLOCKSIZE = 65536
    
    linkData = jrcbox_id
    link = jrcbox_path + linkData
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
        passwd = jrcbox_pass
        paramsA = {'requesttoken': rq, 'password': passwd}
        print("JRCbox authenticating...")
        resp = session.post(linkA,params=paramsA)
        if resp.ok:
            print("downloading")
            p = fl.split('/')
            path = '/'.join(p[:-1]) if len(p)>1 else '/'
            fl = p[-1] if len(p)>0 else None
            crc = ""
            if os.path.exists(models_path + fl + ".crc"):
                f = open(models_path + fl+".crc",mode='r')
                crc = f.read()
                f.close()
            elif os.path.exists(models_path + fl):
                crc = getsha256(models_path + fl)
 
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
                    f = open(models_path + fl, 'wb')
                    done = 0
                    for chunk in resp.iter_content(chunk_size=65536): 
                        if chunk:
                            f.write(chunk)
                            done = done + len(chunk)
                            print(round(done/(1024*1024)), end=" Mb\r", flush=True)
                    print("\033[K",round(done/(1024*1024)), end=" Mb\n", flush=True)
                    f.close()
                    print("downloaded")
                    crc = getsha256(models_path + fl)
                    f = open(models_path + fl+".crc",mode='w')
                    f.write(crc)
                    f.close()
                    return True
            else:
                print("Data is up-to-date. No need to download.", fl)
    return False

if __name__ == '__main__':
  seta_init()
