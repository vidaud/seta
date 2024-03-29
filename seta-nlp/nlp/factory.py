import time
import logging
import random
import string
from fastapi import FastAPI, Request

from nlp import configuration


def create_fastapi_app() -> FastAPI:
    """Web service app factory"""

    # get root logger
    logger = logging.getLogger(__name__)

    app = FastAPI(
        root_path="/seta-nlp",
        title="SeTA NLP",
        summary="Natural language processing web service.",
        version="1.0.0",
    )

    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        """Logs the time every request takes."""

        if configuration.STAGE.lower() == "test":
            return await call_next(request)

        idem = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
        logger.info("rid=%s start request path=%s", idem, request.url.path)
        start_time = time.time()

        response = await call_next(request)

        process_time = (time.time() - start_time) * 1000
        formatted_process_time = f"{process_time:.2f}"
        logger.info(
            "rid=%s completed_in=%sms status_code=%s",
            idem,
            formatted_process_time,
            response.status_code,
        )

        return response

    _register_routers(app)

    return app


def _register_routers(app: FastAPI):
    # pylint: disable=import-outside-toplevel
    from nlp.routers.file_parser import router as file_parser_router
    from nlp.routers.embeddings import router as embeddings_router
    from nlp.routers.concordance import router as concordance_router

    app.include_router(file_parser_router)
    app.include_router(embeddings_router)
    app.include_router(
        concordance_router,
        prefix="/internal",
        include_in_schema=configuration.STAGE.lower() == "development",
    )
