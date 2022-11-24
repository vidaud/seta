from db.db_config import get_db
from werkzeug.local import LocalProxy

db = LocalProxy(get_db)

def getAllCorpusQueries(username):
    
    usersCollection = db["users"]

    # q = {"username": username, "key": {"$regex": "^corpus-"}}
    q = {"username": username, "key": "corpus-payload"}
    

    state = usersCollection.find_one(q)

    if state == None:
        return None
    else:
        # list_cur = list(state)
        # return list_cur
        return state
