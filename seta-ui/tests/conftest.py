import pytest
import time

from seta_flask_server.config import TestConfig
from seta_flask_server.factory import create_app

from tests.infrastructure.init.db import DbTestSetaApi
import os

"""
    For testing in docker run: pytest -s tests/ --db_host=seta-mongo --db_port=27017
"""

def pytest_addoption(parser):
    parser.addoption("--db_host", action="store", default="localhost", help="database host server") 
    parser.addoption("--db_port", action="store", default="27018", help="database port")
    parser.addoption("--web_root", action="store", default="localhost:8080", help="database port")

@pytest.fixture(scope="session")
def db_host(request):
    return request.config.getoption('--db_host')

@pytest.fixture(scope="session")
def db_port(request):
    return request.config.getoption('--db_port')

@pytest.fixture(scope="session")
def web_root(request):
    return request.config.getoption('--web_root')

@pytest.fixture(scope="session", autouse=True)
def init_os():
    #set the required env read in config
    os.environ["API_SECRET_KEY"] = "testkey1"
    
    return True

@pytest.fixture(scope='module', autouse=True)
def db(db_host, db_port):
    
    config = TestConfig()
        
    if db_host:
        config.DB_HOST = db_host

    if db_port:        
        config.DB_PORT = int(db_port)
               
    db = DbTestSetaApi(db_host=config.DB_HOST, db_port=config.DB_PORT, db_name=config.DB_NAME)
    db.clear_db()
    db.init_db()   

    yield db   

    #db.clear_db()

@pytest.fixture(scope='module')
def app(db_host, db_port, web_root):    
    configuration = TestConfig() 
    
    #configuration.DB_HOST = "localhost"
    #configuration.DB_PORT = 27018

    if db_host:
        configuration.DB_HOST = db_host

    if db_port:        
        configuration.DB_PORT = int(db_port)

    app = create_app(configuration)
    app.testing = True
    
    app.config["PRIVATE_API_URL"] = f"http://{web_root}/seta-api-private/v1/"
    
    with app.app_context(): 
        yield app

@pytest.fixture(scope='module')
def client(app):
    with app.test_client() as client:
        yield client      