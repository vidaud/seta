from infrastructure.extensions import scheduler
from repository.mongo_implementation import DbConfig, UsersBroker
from flask import current_app, g

'''
@scheduler.task('interval', id='delete_revoked_tokens', hours=23, misfire_grace_time=900)
def job1():
    """Run scheduled job delete_revoked_tokens"""
    try:
        deleteRevokedTokens()
        print('Done!')
    except Exception as e:
        print(e)
'''

@scheduler.task('interval', id='delete_archived_data_older_than_three_weeks', minutes=1, misfire_grace_time=900)
def job_delete_archived_data():
    """Run scheduled job delete_archived_data_older_than_three_weeks"""
    print("Run scheduled job delete_archived_data_older_than_three_weeks")
    
    with scheduler.app.app_context():
        config = DbConfig(current_app=current_app, g=g)
        usersBroker = UsersBroker(config)
        usersBroker.delete_old_user()
    