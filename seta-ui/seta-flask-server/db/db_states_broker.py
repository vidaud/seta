from datetime import datetime
import time

from db.db_config import getDb

db = getDb()


def getDbState(username, key):
    usersCollection = db["users"]

    q = {"username": username, "key": key}

    state = usersCollection.find_one(q)

    if state == None:
        return None
    else:
        return state


def setDbState(username, key, value):
    c = db["users"]

    q = {"username": username, "key": key}

    state = c.find_one(q)
    if state == None:
        msg = "There is no such state, so it will be added."
        s = {"username": username, "key": key, "value": value, "created-at": str(datetime.now())}
        c.insert_one(s)
    else:
        msg = "State is found, so it will be set to new value."
        sq = {"username": username, "key": key}
        sv = {"$set": {"value": value, "modified-at": str(time.time())}}
        c.update_one(sq, sv)

    print(msg)
    return msg


def addDbState(username, key, value):
    c = db["users"]
    sq = {"username": username, "key": key, "value": value, "created-at": str(datetime.now())}
    c.insert_one(sq)
    return "ok"


def deleteDbState(username, key):
    c = db["users"]
    sq = {"username": username, "key": key}
    c.delete_one(sq)
    return "ok"


