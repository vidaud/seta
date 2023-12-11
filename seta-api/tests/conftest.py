# pylint: disable=missing-function-docstring,redefined-outer-name
"""
    For testing in docker run: 
    pytest -s tests/ --es_host="seta-es-test:9200" 
                    --db_host="seta-mongo-test" 
                    --dp_port=27017 
                    --db_name="seta-test" 
                    --root_url="seta-auth-test:8080"
"""

import os
import pytest

from Crypto.PublicKey import RSA

from seta_api.config import Config
from seta_api.factory import create_app

from tests.infrastructure.init.mongodb import DbTestSetaApi, load_users_data
from tests.infrastructure.init.es import SetaES


def pytest_addoption(parser):
    parser.addoption(
        "--es_host",
        action="store",
        default="localhost:9200",
        help="database host server",
    )
    parser.addoption(
        "--db_host", action="store", default="localhost", help="database host server"
    )
    parser.addoption("--db_port", action="store", default="27018", help="database port")
    parser.addoption(
        "--db_name", action="store", default="seta-test", help="database name"
    )
    parser.addoption(
        "--root_url", action="store", default="localhost:8080", help="test root url"
    )


@pytest.fixture(scope="session")
def es_host(request):
    return request.config.getoption("--es_host")


@pytest.fixture(scope="session")
def db_host(request):
    return request.config.getoption("--db_host")


@pytest.fixture(scope="session")
def db_port(request):
    return request.config.getoption("--db_port")


@pytest.fixture(scope="session")
def db_name(request):
    return request.config.getoption("--db_name")


@pytest.fixture(scope="session")
def root_url(request):
    return request.config.getoption("--root_url")


@pytest.fixture(scope="session", autouse=True)
def init_os(es_host, db_host, db_port, db_name):
    os.environ["ES_HOST"] = es_host
    os.environ["DB_HOST"] = db_host
    os.environ["DB_NAME"] = db_name
    os.environ["DB_PORT"] = db_port

    return True


@pytest.fixture(scope="session", autouse=True)
def es(es_host):
    config = TestConfig()

    es = SetaES(host=es_host, index=config.INDEX_PUBLIC)
    es.cleanup()
    # es.init_es()

    yield es

    es.cleanup()


@pytest.fixture(scope="session")
def user_key_pairs():
    """Generate rsa pair for a user list."""

    user_key_pairs = {}

    data = load_users_data()

    for user in data["users"]:
        user_key_pairs[user["user_id"]] = _generate_rsa_pair()

    yield user_key_pairs


@pytest.fixture(scope="session", autouse=True)
def db(db_host, db_port, db_name, user_key_pairs):
    db = DbTestSetaApi(
        db_host=db_host,
        db_port=int(db_port),
        db_name=db_name,
        user_key_pairs=user_key_pairs,
    )

    db.clear_db()
    db.init_db()

    yield db

    db.clear_db()


@pytest.fixture(scope="module")
def app(root_url):
    config = TestConfig()

    # pylint: disable-next=invalid-name
    config.JWT_TOKEN_INFO_URL = f"http://{root_url}/authorization/v1/token_info"
    # pylint: disable-next=invalid-name
    config.CATALOGUE_API_ROOT_URL = f"http://{root_url}/seta-ui/api/v1/catalogue/"

    app = create_app(config)
    app.testing = True
    app.config["JWT_TOKEN_AUTH_URL"] = f"http://{root_url}/authentication/v1/token"

    with app.app_context():
        yield app


@pytest.fixture(scope="module")
def client(app):
    with app.test_client() as client:
        yield client


def _generate_rsa_pair() -> dict:
    key_pair = RSA.generate(bits=4096)

    # public key
    pub_key = key_pair.public_key()
    pub_key_pem = pub_key.export_key()
    decoded_pub_key_pem = pub_key_pem.decode("ascii")

    # private key
    priv_key_pem = key_pair.export_key()
    decoded_priv_key_pem = priv_key_pem.decode("ascii")

    return {"privateKey": decoded_priv_key_pem, "publicKey": decoded_pub_key_pem}


class TestConfig(Config):
    def __init__(self) -> None:
        current_dir = os.path.dirname(__file__)

        Config.CONFIG_APP_FILE = os.path.join(current_dir, "../../seta-config/api.conf")
        Config.CONFIG_LOGS_FILE = os.path.join(
            current_dir, "../../seta-config/logs.conf"
        )

        super().__init__(section_name="Test")
