from flask.helpers import get_debug_flag
import pymongo
import config


def getDb():
    myclient = pymongo.MongoClient(config.MONGO_DB)
    mydb = myclient["seta"]
    # Create database
    if "seta" not in myclient.list_database_names():
        # Create collections
        collectionNames = mydb.list_collection_names()
        collections = [ 'archive', 'logs', 'users']
        for name in collections:
            if name not in collectionNames:
                mydict = { "test": "test" }
                x = mydb[name].insert_one(mydict)
    return mydb
