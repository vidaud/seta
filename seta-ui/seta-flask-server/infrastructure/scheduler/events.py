import logging

logger = logging.getLogger("flask_apscheduler")

"""Log scheduler events."""

from apscheduler.events import (
    EVENT_JOB_ERROR,
    EVENT_JOB_EXECUTED,
)

from infrastructure.extensions import scheduler

def job_error(event):
    """Job error event."""
    with scheduler.app.app_context():
        logger.exception(f"{repr(event)} failed")
        
def job_executed(event):
    """Job executed event."""
    with scheduler.app.app_context():
        logger.info(f"{repr(event)} executed")
        
scheduler.add_listener(job_error, EVENT_JOB_ERROR)        
scheduler.add_listener(job_executed, EVENT_JOB_EXECUTED)