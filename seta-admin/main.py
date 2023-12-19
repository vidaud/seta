import time
import logging
import random
import string
from fastapi import FastAPI, Request

from admin.routers.indexes import router as indexes_router

# setup loggers
logging.config.fileConfig("/etc/seta/logging.conf", disable_existing_loggers=False)


def create_app() -> FastAPI():
    """Web service app factory"""

    # get root logger
    logger = logging.getLogger(__name__)

    app = FastAPI(
        root_path="/seta-admin", title="Internal Administration", version="0.0.1"
    )

    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        """Logs the time every request takes."""

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

    app.include_router(indexes_router, tags=["indexes"])

    logger.info("FastAPI initialized.")

    return app
