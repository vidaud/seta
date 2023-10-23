"""Log scheduler events."""
import logging
from apscheduler.events import (
    EVENT_JOB_ERROR,
    EVENT_JOB_EXECUTED,
)

from seta_flask_server.infrastructure.extensions import scheduler

logger = logging.getLogger("flask_apscheduler")


def job_error(event):
    """Job error event."""
    with scheduler.app.app_context():
        logger.exception("%r failed", event)


def job_executed(event):
    """Job executed event."""
    with scheduler.app.app_context():
        logger.info("%r executed", event)


scheduler.add_listener(job_error, EVENT_JOB_ERROR)
scheduler.add_listener(job_executed, EVENT_JOB_EXECUTED)
