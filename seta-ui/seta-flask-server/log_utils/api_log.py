from pymongo import MongoClient
from db_config import getDb
from log_utils.log_line import LogLine


class ApiLog:
    def __init__(self):
        # config = yaml.load(open("config.yaml"), Loader=yaml.FullLoader)
        # connection_string = config['connection_string']
        # client = MongoClient(connection_string)
        # db = client.seta
        db = getDb()
        self.collection = db.logs

    def write_log(self, log_line: LogLine):
        self.collection.insert_one(log_line.__dict__)
