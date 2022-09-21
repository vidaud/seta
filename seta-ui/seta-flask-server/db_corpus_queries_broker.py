from db_config import getDb

db = getDb()


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
