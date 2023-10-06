import collections
import pytest
import requests

from seta_flask_server.config import Config
from seta_flask_server.factory import create_app

from tests.infrastructure.init.db import DbTestSetaApi
import os

"""
    For testing in docker run: pytest -s tests/ --db_host=seta-mongo-test --db_port=27017 --db_name=seta-test --api_root=seta-api-test:8081 --auth_root=seta-auth-test:8082
"""

def pytest_addoption(parser):
    parser.addoption("--db_host", action="store", default="localhost", help="database host server") 
    parser.addoption("--db_port", action="store", default="27018", help="database port")
    parser.addoption("--db_name", action="store", default="seta-test", help="database name") 
    parser.addoption("--api_root", action="store", default="localhost:8080", help="seta-api url")
    parser.addoption("--auth_root", action="store", default="localhost:8080", help="seta-auth url")

@pytest.fixture(scope="session")
def db_host(request):
    return request.config.getoption('--db_host')

@pytest.fixture(scope="session")
def db_port(request):
    return request.config.getoption('--db_port')

@pytest.fixture(scope="session")
def db_name(request):
    return request.config.getoption('--db_name')

@pytest.fixture(scope="session")
def api_root(request):
    return request.config.getoption('--api_root')

@pytest.fixture(scope="session")
def auth_root(request):
    return request.config.getoption('--auth_root')

@pytest.fixture(scope="session", autouse=True)
def init_os(db_host, db_port, db_name):
    #! set the same API_SECRET_KEY in the .env.test file
    os.environ["API_SECRET_KEY"] = "testkey1"
    os.environ["GITHUB_CLIENT_ID"] = "seta"
    os.environ["GITHUB_CLIENT_SECRET"] = "seta"

    os.environ["DB_HOST"] = db_host
    os.environ["DB_NAME"] = db_name
    os.environ["DB_PORT"] = db_port
    
    return True

@pytest.fixture(scope="session")
def authentication_url(auth_root):    
    return f"http://{auth_root}/authentication/v1/user/token"

@pytest.fixture(scope='module', autouse=True)
def db(db_host, db_port, db_name):               
    db = DbTestSetaApi(db_host=db_host, db_port=int(db_port), db_name=db_name)
    db.clear_db()
    db.init_db() 

    yield db   

    db.clear_db()

@pytest.fixture(scope='module')
def app(api_root):
    config = TestConfig()
    config.PRIVATE_API_URL = f"http://{api_root}/seta-api-private/v1"
    

    app = create_app(config)
    app.testing = True
    
    with app.app_context(): 
        yield app

@pytest.fixture(scope='module')
def client(app):
    with app.test_client() as client:
        yield client
        
@pytest.fixture(scope="module")
def seta_api_corpus(api_root: str):
    seta_api_corpus = f"http://{api_root}/seta-api-test/corpus"
       
    yield seta_api_corpus
    
    #remove everything from ES
    cleanup_url = f"http://{api_root}/seta-api-test/cleanup"
    requests.post(cleanup_url)    


class TestConfig(Config):
    def __init__(self) -> None:
        current_dir = os.path.dirname(__file__)

        Config.CONFIG_APP_FILE = os.path.join(current_dir, '../../seta-config/ui.conf')
        Config.CONFIG_LOGS_FILE = os.path.join(current_dir, '../../seta-config/logs.conf')

        super().__init__(section_name='Test')