# pylint: disable=W0621, C0301, C0116
"""Seta-search testing with pytest.

Usage:

    For testing in docker run: 
    pytest -s tests/ --settings=LOCAL
"""

import os
import configparser
from pathlib import Path
import pytest

from search.config import Config
from search.factory import create_app

from tests.infrastructure.init.postgresql import PostgDbTest, PostgDBConnection
from tests.infrastructure.init.es import SetaES
from tests.infrastructure.helpers.util import generate_rsa_pair
from tests.infrastructure.helpers.data_loader import load_users_data


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

    config = configparser.ConfigParser()
    config.read(conf_path)
    config_section = config[settings]

    os.environ["ES_HOST"] = config_section["ES_HOST"]
    os.environ["DB_HOST"] = config_section["DB_HOST"]
    os.environ["DB_NAME"] = config_section["DB_NAME"]
    os.environ["DB_PORT"] = config_section["DB_PORT"]

    os.environ["DB_USER"] = config_section["DB_USER"]
    os.environ["DB_PASSWORD"] = config_section["DB_PASSWORD"]

    os.environ["AUTH_ROOT"] = config_section["AUTH_ROOT"]
    os.environ["NLP_ROOT"] = config_section["NLP_ROOT"]
    os.environ["ADMIN_ROOT"] = config_section["ADMIN_ROOT"]

    return True


@pytest.fixture(scope="session")
def auth_root():
    return os.environ["AUTH_ROOT"]


@pytest.fixture(scope="session")
def nlp_url():
    """Root of seta-nlp web service."""

    nlp_root = os.environ["NLP_ROOT"]
    return f"http://{nlp_root}/seta-nlp/"


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
def app(auth_root, nlp_url, user_key_pairs):
    config = TestConfig(auth_root=auth_root, nlp_url=nlp_url)

    app = create_app(config)
    app.testing = True

    db_test = PostgDbTest(
        db_connection=PostgDBConnection(
            db_host=config.DB_HOST,
            db_port=config.DB_PORT,
            db_name=config.DB_NAME,
            db_user=config.DB_USER,
            db_pass=config.DB_PASSWORD,
        ),
        user_key_pairs=user_key_pairs,
    )

    es = SetaES(host=config.ES_HOST, index=config.INDEX_PUBLIC)

    with app.app_context():

        db_test.clear_db()
        db_test.init_db()

        es.cleanup()

        # TODO: Add data to ES, init_es is failing
        # es.init_es()

        yield app

        db_test.clear_db()
        es.cleanup()


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

        TestConfig.DB_HOST = os.environ.get("DB_HOST")
        TestConfig.DB_NAME = os.environ.get("DB_NAME")
        TestConfig.DB_PORT = 5432

        port = os.environ.get("DB_PORT")
        if port:
            TestConfig.DB_PORT = int(port)

        TestConfig.DB_USER = os.environ.get("DB_USER")
        TestConfig.DB_PASSWORD = os.environ.get("DB_PASSWORD")
