# pylint: disable=W0621, C0301
"""Seta-ui testing with pytest.

Usage:

    For testing in docker run: 
    pytest -s tests/ --db_host=seta-postgres-test --db_port=5433 --db_name=seta-test --admin_root=seta-amin-test:8080 --auth_root=seta-auth-test:8082
"""

import os
import configparser
from pathlib import Path
import pytest

from seta_flask_server.config import Config
from seta_flask_server.factory import create_app
from seta_flask_server.infrastructure.extensions import db

from tests.infrastructure.init.postg_db import PostgDbTest
from tests.infrastructure.helpers.util import generate_rsa_pair
from tests.infrastructure.helpers.users_data import load_users_data


def pytest_addoption(parser):
    """Command line options."""

    parser.addoption(
        "--settings",
        action="store",
        default="LOCAL",
        help="Section name from 'test.conf' file. LOCAL, REMOTE",
    )


@pytest.fixture(scope="session")
def settings(request):
    return request.config.getoption("--settings")


@pytest.fixture(scope="session", autouse=True)
def init_os(settings):
    """Initialize environment variables for config."""

    base_path = Path(__file__).parent
    conf_path = (base_path / "test.conf").resolve()
    secrets_conf_path = (base_path / "secrets.conf").resolve()

    secrets_config = configparser.ConfigParser()
    secrets_config.read(secrets_conf_path)
    secrets_config_section = secrets_config["TEST"]

    os.environ["API_SECRET_KEY"] = secrets_config_section["API_SECRET_KEY"]
    os.environ["GITHUB_CLIENT_ID"] = secrets_config_section["GITHUB_CLIENT_ID"]
    os.environ["GITHUB_CLIENT_SECRET"] = secrets_config_section["GITHUB_CLIENT_SECRET"]

    config = configparser.ConfigParser()
    config.read(conf_path)
    config_section = config[settings]

    os.environ["DB_HOST"] = config_section["DB_HOST"]
    os.environ["DB_NAME"] = config_section["DB_NAME"]
    os.environ["DB_PORT"] = config_section["DB_PORT"]
    os.environ["DB_USER"] = config_section["DB_USER"]
    os.environ["DB_PASSWORD"] = config_section["DB_PASSWORD"]

    os.environ["AUTH_ROOT"] = config_section["AUTH_ROOT"]
    os.environ["ADMIN_ROOT"] = config_section["ADMIN_ROOT"]

    return True


@pytest.fixture(scope="session")
def authentication_url():
    """Authentication URL."""

    auth_root = os.environ["AUTH_ROOT"]
    return f"http://{auth_root}/authentication/v1/token"


@pytest.fixture(scope="session")
def admin_url():
    """Root of seta-admin web service."""
    admin_root = os.environ["ADMIN_ROOT"]

    return f"http://{admin_root}/"


@pytest.fixture(scope="session")
def user_key_pairs():
    """Generate rsa pair for a user list."""

    user_key_pairs = {}

    data = load_users_data()

    for user in data["users"]:
        user_key_pairs[user["user_id"]] = generate_rsa_pair()

    yield user_key_pairs


@pytest.fixture(scope="session")
def app(admin_url, user_key_pairs):
    """Initialize test application."""

    config = TestConfig()
    config.INTERNAL_ADMIN_API = admin_url

    app = create_app(config)
    app.testing = True

    db_test = PostgDbTest(db=db, user_key_pairs=user_key_pairs)

    with app.app_context():
        db_test.clear_db()
        db_test.init_db()

        yield app

        db_test.clear_db()


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
