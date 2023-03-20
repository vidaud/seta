import pytest
import time
from elasticsearch import Elasticsearch

from seta_api.config import TestConfig
from seta_api.factory import create_app

from tests.infrastructure.init.mongodb import DbTestSetaApi
from tests.infrastructure.init.es import SetaES

"""
    For testing in docker run: pytest -s tests/ --es_host="seta-es-test:9200" --db_host="seta-mongo-test" --dp_port=27017 --web_root="seta-ui-test:8080"
"""

def pytest_addoption(parser):
    parser.addoption("--es_host", action="store", default="localhost:9200", help="database host server")
    parser.addoption("--db_host", action="store", default="localhost", help="database host server") 
    parser.addoption("--db_port", action="store", default="27018", help="database port") 
    parser.addoption("--web_root", action="store", default="localhost:8080", help="database port")

@pytest.fixture(scope="session")
def es_host(request):
    return request.config.getoption('--es_host')

@pytest.fixture(scope="session")
def db_host(request):
    return request.config.getoption('--db_host')

@pytest.fixture(scope="session")
def db_port(request):
    return request.config.getoption('--db_port')

@pytest.fixture(scope="session")
def web_root(request):
    return request.config.getoption('--web_root')

@pytest.fixture(scope='session', autouse=True)
def es(es_host):
    config = TestConfig()    
    host = config.ES_HOST
        
    if es_host:
        host = es_host
        
    es = SetaES(host=host, index=config.INDEX_PUBLIC)
    es.cleanup()
    es.init_es()
    
    yield es
    
    es.cleanup()
    

@pytest.fixture(scope='module')
def app(es_host, db_host, db_port, web_root):
    config = TestConfig() 
    
    if es_host:
        config.ES_HOST = es_host
        
    if db_host:
        config.DB_HOST = db_host

    if db_port:        
        config.DB_PORT = int(db_port)
                
    app = create_app(config)
    app.config["JWT_TOKEN_INFO_URL"] = f"http://{web_root}/authorization/v1/token_info"
    app.config["JWT_TOKEN_AUTH_URL"] = f"http://{web_root}/authentication/v1/user/token"
    
    with app.app_context():  
        
        db_name="seta_test"
        
        time_str = str(int(time.time()))
        db_name += f"_{time_str}"
               
        db = DbTestSetaApi(db_host=config.DB_HOST, db_port=config.DB_PORT, db_name=db_name)
        db.clear_db()
        db.init_db()   
    
        yield app   

        db.clear_db()

@pytest.fixture(scope='module')
def client(app):
    with app.test_client() as client:
        yield client