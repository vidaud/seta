import pytest
import time

from seta_flask_server.config_test import TestConfig
from seta_flask_server.factory import create_app

from tests.infrastructure.mongodb.db import DbTestSetaApi

"""
    For testing in docker run: pytest -s tests/ --db_host=seta-mongo --db_port=27017
"""

def pytest_addoption(parser):
    parser.addoption("--db_host", action="store", default="localhost", help="database host server") 
    parser.addoption("--db_port", action="store", default="27018", help="database port")

@pytest.fixture(scope="session")
def db_host(request):
    return request.config.getoption('--db_host')

@pytest.fixture(scope="session")
def db_port(request):
    return request.config.getoption('--db_port')

@pytest.fixture(scope='module')
def app(db_host, db_port):
    configuration = TestConfig() 
    
    #configuration.DB_HOST = "localhost"
    #configuration.DB_PORT = 27018

    if db_host:
        configuration.DB_HOST = db_host

    if db_port:        
        configuration.DB_PORT = int(db_port)

    time_str = str(int(time.time()))
    configuration.DB_NAME = configuration.DB_NAME + f"_{time_str}"

    app = create_app(configuration)
    app.testing = True
    
    with app.app_context(): 
        db = DbTestSetaApi()
        db.init_db()   
    
        yield app   

        db.clear_db()

@pytest.fixture(scope='module')
def client(app):
    with app.test_client() as client:
        yield client      