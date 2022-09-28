from datetime import datetime
import time

from db.db_config import getDb

db = getDb()

def getDbRsaKey(username, isPublicKey):
    usersCollection = db["users"]

    q = {"username": username, "is-rsa-key": True, "is-public-key": isPublicKey}

    key = usersCollection.find_one(q)

    if key == None:
        return None
    else:
        return key

def setDbRsaKey(username, isPrivateKey, value):
    c = db["users"]

    q = {
        "username": username, 
        "is-rsa-key": True, 
        "is-private-key": isPrivateKey,
        "is-public-key": not isPrivateKey
    }

    key = c.find_one(q)
    if key == None: 
        msg = "There is no such key, so it will be added."
        s = {
            "username": username, 
            "is-rsa-key": True, 
            "is-private-key": isPrivateKey, 
            "is-public-key": not isPrivateKey,
            "value": value,
            "created-at": str(datetime.now())
        }
        c.insert_one(s)
    else:
        msg = "Key is found, so it will be updated to the new value."
        sq = {
            "username": username, 
            "is-rsa-key": True, 
            "is-private-key": isPrivateKey,
            "is-public-key": not isPrivateKey
            
        }
        uq = {"$set": {"value": value, "modified-at": str(time.time())}}
        c.update_one(sq, uq)

    print(msg)
    return msg


def deleteAllRsaKeysForUser(username):
    
    c = db["users"]
    sq = {"username": username, "is-rsa-key": True}
    c.delete_many(sq)
    return



