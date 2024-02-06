# pylint: disable=W0621, C0301
"""Seta-NLP testing with pytest.

Usage:

    For testing in docker run: 
    pytest -s tests/ --settings=LOCAL
"""
import os
import configparser
from pathlib import Path
import logging
import logging.config
import pytest

from fastapi.testclient import TestClient

from nlp import configuration
from nlp.factory import create_fastapi_app

from tests.infrastructure.init.postgresql import PostgDbTest, PostgDBConnection
from tests.infrastructure.helpers.users_data import load_users_data
from tests.infrastructure.helpers.util import generate_rsa_pair


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
    """Settings from command line."""

    return request.config.getoption("--settings")


@pytest.fixture(scope="session", autouse=True)
def init_os(settings):
    """Initialize environment variables for config."""

    base_path = Path(__file__).parent
    conf_path = (base_path / "test.conf").resolve()

    config = configparser.ConfigParser()
    config.read(conf_path)
    config_section = config[settings]

    os.environ["STAGE"] = "Test"

    os.environ["DB_HOST"] = config_section["DB_HOST"]
    os.environ["DB_NAME"] = config_section["DB_NAME"]
    os.environ["DB_PORT"] = config_section["DB_PORT"]

    os.environ["DB_USER"] = config_section["DB_USER"]
    os.environ["DB_PASSWORD"] = config_section["DB_PASSWORD"]

    os.environ["AUTH_ROOT"] = config_section["AUTH_ROOT"]
    os.environ["NLP_ROOT"] = config_section["NLP_ROOT"]

    return True


@pytest.fixture(scope="session")
def authorization_url():
    """Authorization URL."""

    auth_root = os.environ["AUTH_ROOT"]
    return f"http://{auth_root}/authorization/v1/token_info"


@pytest.fixture(scope="session")
def authentication_url():
    """Authentication URL."""

    auth_root = os.environ["AUTH_ROOT"]
    return f"http://{auth_root}/authentication/v1/token"


@pytest.fixture(scope="session")
def nlp_url():
    """Root of seta-nlp web service."""

    nlp_root = os.environ["NLP_ROOT"]
    return f"http://{nlp_root}/seta-nlp"


@pytest.fixture(scope="session")
def user_key_pairs():
    """Generate rsa pair for a user list."""

    user_key_pairs = {}

    data = load_users_data()

    for user in data["users"]:
        user_key_pairs[user["user_id"]] = generate_rsa_pair()

    yield user_key_pairs


@pytest.fixture(scope="session")
def app(authorization_url, user_key_pairs):
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

    db_test = PostgDbTest(
        db_connection=PostgDBConnection(
            db_host=os.environ["DB_HOST"],
            db_port=int(os.environ["DB_PORT"]),
            db_name=os.environ["DB_NAME"],
            db_user=os.environ["DB_USER"],
            db_pass=os.environ["DB_PASSWORD"],
        ),
        user_key_pairs=user_key_pairs,
    )

    db_test.clear_db()
    db_test.init_db()

    yield app

    db_test.clear_db()


@pytest.fixture(scope="module")
def client(app):
    """Flask test client."""

    with TestClient(app) as client:
        yield client
