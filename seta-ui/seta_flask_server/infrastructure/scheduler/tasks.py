import pytz
from datetime import datetime, timedelta

from seta_flask_server.infrastructure.extensions import scheduler
from seta_flask_server.repository.mongo_implementation import DbConfig, UsersBroker, SessionsBroker
from flask import current_app, g

@scheduler.task('interval', id='unblock_tokens', hours=23, misfire_grace_time=900)
def job1():
    """Run scheduled job unblock_tokens"""

    with scheduler.app.app_context():
        config = DbConfig(current_app=current_app, g=g)
        sessionsBroker = SessionsBroker(config)

        hours = current_app.config.get("UNBLOCK_TOKENS_HOURS", 48)

        blocked_at = datetime.now(tz=pytz.utc) - timedelta(hours=hours)
        sessionsBroker.unblock_session_tokens(blocked_at)

@scheduler.task('interval', id='delete_archived_data_older_than_three_weeks', hours=24, misfire_grace_time=900)
def job_delete_archived_data():
    """Run scheduled job delete_archived_data_older_than_three_weeks"""
    #print("Run scheduled job delete_archived_data_older_than_three_weeks")
    
    with scheduler.app.app_context():
        config = DbConfig(current_app=current_app, g=g)
        usersBroker = UsersBroker(config)
        #usersBroker.delete_old_user()
    