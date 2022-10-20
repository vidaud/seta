from flask import current_app, g
from flask_pymongo import PyMongo


def get_db():
    """
    Configuration method to return db instance
    """
    
    db = getattr(g, "_database", None)

    if db is None:
        db = g._database = PyMongo(current_app).db
        
        """Create indexes here"""
        
    return db
    
'''
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
'''    