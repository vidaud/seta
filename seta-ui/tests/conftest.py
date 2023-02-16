import pytest
import time

from seta_flask_server.config import TestConfig
from seta_flask_server.factory import create_app

from tests.infrastructure.mongodb.db import DbTestSetaApi

@pytest.fixture(scope='module')
def app():
    configuration = TestConfig() 
    app = create_app(configuration)
    app.testing = True
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False

    time_str = str(int(time.time()))
    app.config["DB_NAME"] = app.config["DB_NAME"] + f"_{time_str}"
    app.config["MONGO_URI"] = app.config["MONGO_URI"] + f"_{time_str}"
    
    with app.app_context(): 
        db = DbTestSetaApi()
        db.init_db()   
    
        yield app   

        db.clear_db()

@pytest.fixture(scope='module')
def client(app):
    with app.test_client() as client:
        yield client      