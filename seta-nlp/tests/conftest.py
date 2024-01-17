# pylint: disable=W0621, C0301
"""Seta-ui testing with pytest.

Usage:

    For testing in docker run: 
    pytest -s tests/ --db_host=seta-mongo-test --db_port=27017 --db_name=seta-test --auth_root=seta-auth-test:8082 --nlp_root=seta-nlp-test:8000
"""
import os
import logging
import logging.config
import pytest

from fastapi.testclient import TestClient

from nlp import configuration
from nlp.factory import create_fastapi_app

from tests.infrastructure.init.mongodb import DbTestSetaApi, load_users_data
from tests.infrastructure.helpers.util import generate_rsa_pair


def pytest_addoption(parser):
    """Command line options."""

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
        "--nlp_root", action="store", default="localhost:8080", help="seta-nlp url"
    )


@pytest.fixture(scope="session")
def db_host(request):
    """Database host."""
    return request.config.getoption("--db_host")


@pytest.fixture(scope="session")
def db_port(request):
    """Database port."""
    return request.config.getoption("--db_port")


@pytest.fixture(scope="session")
def db_name(request):
    """Database name."""
    return request.config.getoption("--db_name")


@pytest.fixture(scope="session")
def authorization_url(request):
    """Authorization URL."""

    auth_root = request.config.getoption("--auth_root")
    return f"http://{auth_root}/authorization/v1/token_info"


@pytest.fixture(scope="session")
def authentication_url(request):
    """Authentication URL."""

    auth_root = request.config.getoption("--auth_root")
    return f"http://{auth_root}/authentication/v1/token"


@pytest.fixture(scope="session")
def nlp_url(request):
    """Root of seta-nlp web service."""

    nlp_root = request.config.getoption("--nlp_root")
    return f"http://{nlp_root}/seta-nlp"


@pytest.fixture(scope="session", autouse=True)
def init_os(db_host, db_port, db_name):
    """Initialize environment variables for config."""

    os.environ["STAGE"] = "Test"
    os.environ["DB_HOST"] = db_host
    os.environ["DB_NAME"] = db_name
    os.environ["DB_PORT"] = db_port

    return True


@pytest.fixture(scope="session")
def user_key_pairs():
    """Generate rsa pair for a user list."""

    user_key_pairs = {}

    data = load_users_data()

    for user in data["users"]:
        user_key_pairs[user["user_id"]] = generate_rsa_pair()

    yield user_key_pairs


@pytest.fixture(scope="module", autouse=True)
def db(db_host, db_port, db_name, user_key_pairs):
    """Initialize test database."""

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
def app(authorization_url):
    """Initialize test application."""

    current_dir = os.path.dirname(__file__)

    logging_path = os.path.join(current_dir, "../../seta-config/logging.conf")
    logging.config.fileConfig(logging_path, disable_existing_loggers=False)

    configuration.CONFIG_APP_FILE = os.path.join(
        current_dir, "../../seta-config/nlp.conf"
    )
    configuration.init()
    configuration.configuration.JWT_TOKEN_INFO_URL = authorization_url

    app = create_fastapi_app()

    yield app


@pytest.fixture(scope="module")
def client(app):
    """Flask test client."""

    with TestClient(app) as client:
        yield client
