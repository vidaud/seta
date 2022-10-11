from log_utils.log_line import LogLine

from db.db_config import get_db
from werkzeug.local import LocalProxy

db = LocalProxy(get_db)

class ApiLog:
    def __init__(self):
        self.collection = db.logs

    def write_log(self, log_line: LogLine):
        self.collection.insert_one(log_line.__dict__)
