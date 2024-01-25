# pylint: disable=W0621, C0301
"""Seta-ui testing with pytest.

Usage:

    For testing in docker run: 
    pytest -s tests/ --db_host=seta-mongo-test --db_port=27017 --db_name=seta-test --admin_root=seta-amin-test:8080 --auth_root=seta-auth-test:8082
"""

import os
import configparser
from pathlib import Path
import pytest

from seta_flask_server.config import Config
from seta_flask_server.factory import create_app

from tests.infrastructure.init.db import DbTestSetaApi, load_users_data
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
        "--admin_root", action="store", default="localhost:8080", help="seta-admin url"
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
def authentication_url(request):
    """Authentication URL."""

    auth_root = request.config.getoption("--auth_root")
    return f"http://{auth_root}/authentication/v1/token"


@pytest.fixture(scope="session")
def admin_url(request):
    """Root of seta-admin web service."""
    admin_root = request.config.getoption("--admin_root")

    return f"http://{admin_root}/"


@pytest.fixture(scope="session", autouse=True)
def init_os(db_host, db_port, db_name):
    """Initialize environment variables for config."""

    base_path = Path(__file__).parent
    conf_path = (base_path / "test.conf").resolve()

    config = configparser.ConfigParser()
    config.read(conf_path)
    config_section = config["TEST"]

    os.environ["API_SECRET_KEY"] = config_section["API_SECRET_KEY"]
    os.environ["GITHUB_CLIENT_ID"] = config_section["GITHUB_CLIENT_ID"]
    os.environ["GITHUB_CLIENT_SECRET"] = config_section["GITHUB_CLIENT_SECRET"]

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
def app(admin_url):
    """Initialize test application."""

    config = TestConfig()
    config.INTERNAL_ADMIN_API = admin_url

    app = create_app(config)
    app.testing = True

    with app.app_context():
        yield app


@pytest.fixture(scope="module")
def client(app):
    """Flask test client."""

    with app.test_client() as client:
        yield client


class TestConfig(Config):
    def __init__(self) -> None:
        current_dir = os.path.dirname(__file__)

        Config.CONFIG_APP_FILE = os.path.join(current_dir, "../../seta-config/ui.conf")
        Config.CONFIG_LOGS_FILE = os.path.join(
            current_dir, "../../seta-config/logs.conf"
        )

        super().__init__(section_name="Test")
