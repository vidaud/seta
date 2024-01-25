# pylint: disable=W0621, C0301, C0116
"""Seta-search testing with pytest.

Usage:

    For testing in docker run: 
    pytest -s tests/ --es_host="seta-es-test:9200" --db_host=seta-mongo-test --db_port=27017 --db_name=seta-test 
                    --admin_root=seta-amin-test:8080 --auth_root=seta-auth-test:8082 --nlp_root=seta-nlp-test:8000
"""

import os
import pytest

from search.config import Config
from search.factory import create_app

from tests.infrastructure.init.mongodb import DbTestSetaApi, load_users_data
from tests.infrastructure.init.es import SetaES
from tests.infrastructure.helpers.util import generate_rsa_pair


def pytest_addoption(parser):
    """Command line options."""

    parser.addoption(
        "--es_host",
        action="store",
        default="localhost:9200",
        help="search host server",
    )

    parser.addoption(
        "--db_host", action="store", default="localhost", help="database host server"
    )
    parser.addoption("--db_port", action="store", default="27018", help="database port")
    parser.addoption(
        "--db_name", action="store", default="seta-test", help="database name"
    )
    parser.addoption(
        "--auth_root", action="store", default="localhost:8080", help="seta-auth url"
    )
    parser.addoption(
        "--admin_root", action="store", default="localhost:8080", help="seta-admin url"
    )
    parser.addoption(
        "--nlp_root", action="store", default="localhost:8080", help="seta-nlp url"
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
def auth_root(request):
    return request.config.getoption("--auth_root")


@pytest.fixture(scope="session")
def nlp_url(request):
    """Root of seta-nlp web service."""

    nlp_root = request.config.getoption("--nlp_root")
    return f"http://{nlp_root}/seta-nlp/"


@pytest.fixture(scope="session")
def admin_url(request):
    """Root of seta-admin web service."""
    admin_root = request.config.getoption("--admin_root")

    return f"http://{admin_root}/"


@pytest.fixture(scope="session", autouse=True)
def init_os(es_host, db_host, db_port, db_name):
    os.environ["ES_HOST"] = es_host
    os.environ["DB_HOST"] = db_host
    os.environ["DB_NAME"] = db_name
    os.environ["DB_PORT"] = db_port

    return True


@pytest.fixture(scope="session", autouse=True)
def es(es_host):
    config = TestConfig(auth_root="localhost:8080", nlp_url="localhost:8080")

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
        user_key_pairs[user["user_id"]] = generate_rsa_pair()

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
def app(auth_root, nlp_url):
    config = TestConfig(auth_root=auth_root, nlp_url=nlp_url)

    app = create_app(config)
    app.testing = True

    with app.app_context():
        yield app


@pytest.fixture(scope="module")
def client(app):
    with app.test_client() as client:
        yield client


class TestConfig(Config):
    def __init__(self, auth_root: str, nlp_url: str) -> None:
        current_dir = os.path.dirname(__file__)

        Config.CONFIG_APP_FILE = os.path.join(
            current_dir, "../../seta-config/search.conf"
        )
        Config.CONFIG_LOGS_FILE = os.path.join(
            current_dir, "../../seta-config/logs.conf"
        )

        super().__init__(section_name="Test")

        TestConfig.JWT_TOKEN_INFO_URL = (
            f"http://{auth_root}/authorization/v1/token_info"
        )
        TestConfig.JWT_TOKEN_AUTH_URL = f"http://{auth_root}/authentication/v1/token"
        TestConfig.NLP_API_ROOT_URL = nlp_url
