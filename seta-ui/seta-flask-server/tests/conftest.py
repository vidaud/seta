import pytest
import config
from factory import create_app
from tests.infrastructure.mongodb.db import DbTest

@pytest.fixture(scope='module')
def app():
    configuration = config.TestConfig() 
    app = create_app(configuration)
    app.testing = True
    
    with app.app_context():
        dbTest = DbTest()
        dbTest.init_db()        
        yield app
        dbTest.clear_db()
        

@pytest.fixture(scope='module')
def client(app):
    with app.test_client() as client:
        yield client        