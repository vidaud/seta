from datetime import datetime, timedelta
import pytz

from seta_flask_server.infrastructure.extensions import scheduler
from seta_flask_server.repository.mongo_implementation import (
    DbConfig,
    SessionsBroker,
)
from flask import current_app, g


@scheduler.task("interval", id="unblock_tokens", hours=23, misfire_grace_time=900)
def job_unblock_tokens():
    """Run scheduled job unblock_tokens"""

    with scheduler.app.app_context():
        config = DbConfig(current_app=current_app, g=g)
        sessions_broker = SessionsBroker(config)

        hours = current_app.config.get("UNBLOCK_TOKENS_HOURS", 48)

        blocked_at = datetime.now(tz=pytz.utc) - timedelta(hours=hours)
        sessions_broker.unblock_session_tokens(blocked_at)
