from datetime import datetime, timedelta
import pymongo
from pymongo.results import DeleteResult

import config
from db_config import getDb

db = getDb()


def addRevokedToken(username, jti, t):

    usersCollection = db["users"]
    
    t = {
        "username": username,
        "is-revoked-token": True,
        "jwt": jti,
        "revoked-at": t
    }

    # Only add to list of revoked tokens if not added already, no need for duplicates
    if(isTokenRevoked(jti)):
        return "ok"
    else:
        usersCollection.insert_one(t)
        return "ok"

def isTokenRevoked(jwt):
    uc = db["users"]
    # "username": username,
    token = uc.find_one({ 
        "is-revoked-token": True,
        "jwt": jwt })

    if token == None:
        return False
    else:
        return True

def getAllUserRevokedTokensDb(username=None):
    uc = db["users"]

    if None == username:
        revokedTokens = uc.find({"is-revoked-token": True})
    else:
        revokedTokens = uc.find({"username": username, "is-revoked-token": True})

    tokens = []
    if revokedTokens == None:
        print("no revoked tokens")
    else:
        for token in revokedTokens:
            tokens.append(token["jwt"])
    return tokens


def deleteRevokedTokens():
    uc = db["users"]
    nowMinus1HourStr = str(datetime.now() - timedelta(hours=1))
    resultDeleted: DeleteResult = uc.delete_many({"is-revoked-token": True,"revoked-at": {"$lt":  nowMinus1HourStr}})
    return dict(resultDeleted)

    
            



        
