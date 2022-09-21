from pymongo import MongoClient
import yaml
from log_utils.log_line import LogLine


class ApiLog:
    def __init__(self):
        config = yaml.load(open("config.yaml"), Loader=yaml.FullLoader)
        connection_string = config['mongodb-host']
        client = MongoClient(connection_string)
        db = client.seta
        self.collection = db.logs

    def write_log(self, log_line: LogLine):
        self.collection.insert_one(log_line.__dict__)
