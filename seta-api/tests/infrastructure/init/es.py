import json
from elasticsearch import Elasticsearch
from pathlib import Path

from seta_api.apis.corpus.corpus_logic import insert_doc

class SetaES:
    def __init__(self, host: str, index: str) -> None:
        self.index = index
        self.es = Elasticsearch("http://" + host, verify_certs=False, request_timeout=30)
    
    def init_es(self) -> None:
        """
        Add documents to ElasticSearch
        """
        
        base_path = Path(__file__).parent
        data_path="../data/documents.json"
        
        file_path = (base_path / data_path).resolve()
                
        with open(file_path) as fp:
            data = json.load(fp)
        
        if not data:
            return
        
        for document in data:
            insert_doc(args=document, es=self.es, index=self.index)
            
        print("ES insert " + str(len(data)) + " documents.")
        
    
    def cleanup(self) -> None:
        try:
            body = {"query": {"match_all": {}}}
            self.es.delete_by_query(index=self.index, body=body)
        except Exception as e:
            print(e)