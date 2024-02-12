import logging
import logging.config

from fastapi import FastAPI

from nlp import configuration
from nlp.factory import create_fastapi_app


# setup loggers
logging.config.fileConfig("/etc/seta/logging.conf", disable_existing_loggers=False)


def create_app() -> FastAPI:
    """Web service app factory"""

    # get root logger
    logger = logging.getLogger(__name__)

    # create configuration
    configuration.init()

    app = create_fastapi_app()

    logger.info("FastAPI NLP initialized.")

    return app
