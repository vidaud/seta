from infrastructure.extensions import scheduler
from db.db_users_broker import deleteUserDataOlderThanThreeWeeks

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

@scheduler.task('interval', id='delete_archived_data_older_than_three_weeks', hours=24, misfire_grace_time=900)
def job_delete_archived_data():
    """Run scheduled job delete_archived_data_older_than_three_weeks"""
    
    deleteUserDataOlderThanThreeWeeks()