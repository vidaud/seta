import hashlib as hash
BLOCKSIZE = 65536


def getsha256(filename):
    sha = hash.sha256()
    with open(filename, 'rb') as f:
        file_buffer = f.read(BLOCKSIZE)
        while len(file_buffer) > 0:
            sha.update(file_buffer)
            file_buffer = f.read(BLOCKSIZE)
    return sha.hexdigest()


def get_crc_from_es(es, index_suggestion):
    body = {"query": {"bool": {"must": [{"exists": {"field": "crc_model"}}]}}}
    resp = es.search(index=index_suggestion, body=body)
    if resp['hits']['total']['value'] == 0:
        crc_es = None
        crc_id = None
    else:
        crc_es = resp['hits']['hits'][0]['_source']['crc_model']
        crc_id = resp['hits']['hits'][0]['_id']
    return crc_es, crc_id
