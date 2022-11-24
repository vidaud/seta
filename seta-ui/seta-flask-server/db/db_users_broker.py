import time
from datetime import datetime, timedelta

from pymongo.results import DeleteResult, InsertManyResult

from db.db_config import get_db
from werkzeug.local import LocalProxy
from flask import current_app as app

db = LocalProxy(get_db)


def addDbUser(u):

    usersCollection = db["users"]
    role = "user"
    if u["email"].lower() in app.config["ROOT_USERS"]:
        role = "admin"

    u = {
        "username": u["uid"],
        "first_name": u["firstName"],
        "last_name": u["lastName"],
        "email": u["email"],
        "domain": u["domain"],
        "role": role,
        "created-at": str(datetime.now())
    }

    usersCollection.insert_one(u)
    return


def getDbUser(username):
    usersCollection = db["users"]
    uq = {"username": username, "email":{"$exists" : True}}

    user = usersCollection.find_one(uq)
    if user is None:
        return None
    else:
        return user


def updateDbUser(username, field, value):
    usersCollection = db["users"]
    userQuery = {"username": username}

    user = usersCollection.find_one(userQuery)
    if user == None:
        return None

    updateParameter = {"$set": {field: value, "modified-at": str(time.time())}}

    usersCollection.update({"username": username}, updateParameter)

    return


def deleteAllDbUserData(username):
    usersCollection = db["archive"]
    uq = {"username": username}

    user = usersCollection.delete_many(uq)

    if user == None:
        return None
    else:
        return "ok"


# def insertBatch(collection, documents):
#     print("insertBatch")
#     bulkInsert = collection.initialize_unordered_bulk_op()
#     insertedIds = []
#     for doc in documents:
#         id = doc["_id"]
#         # Insert without raising an error for duplicates
#         bulkInsert.find({"_id": id}).upsert().replace_one(doc)
#         insertedIds.append(id)
#     try:
#         result = bulkInsert.execute()
#         pprint(result)
#     except BulkWriteError as bwe:
#         pprint(bwe.details)

#     return insertedIds

# def deleteBatch(collection, documents):
#     print("deleteBatch")
#     bulkRemove = collection.initialize_unordered_bulk_op()
#     # entries = documents[:]
#     for doc in documents:
#         print(doc)
#         bulkRemove.find({"_id": str(doc["_id"])}).remove_once()
#     try:
#         result = bulkRemove.execute()
#         pprint(result)
#     except BulkWriteError as bwe:
#         pprint(bwe.details)

# def moveDocuments(sourceCollection: str, targetCollection: str, filter: dict, batchSize):
#     sc = db[sourceCollection]
#     tc = db[targetCollection]
#     print("Moving " + str(sc.find(filter).count()) +
#         " documents from " + sourceCollection + " to " + targetCollection)
#     while (sc.find(filter).count() > 0):
#         count = sc.find(filter).count()
#         print(str(count) + " documents remaining")
#         sourceDocs = sc.find(filter)
#         # .limit(batchSize)
#         idsOfCopiedDocs = insertBatch(tc, sourceDocs)
#         targetDocs = tc.find({"_id": {"$in": idsOfCopiedDocs}})
#         print(targetDocs)
#         deleteBatch(sc, targetDocs)
#     print("Done!")


def moveDocuments(sourceCollection: str, targetCollection: str, filter: dict):
    sc = db[sourceCollection]
    tc = db[targetCollection]
#    print("Moving " + str(sc.find(filter).count()) + " documents from " + sourceCollection + " to " + targetCollection)
    # trova gli id da copiare su sc
    sourceDocs = sc.find(filter)
    result: InsertManyResult = tc.insert_many(sourceDocs, False, True)
    # targetDocs = sc.find({"_id": {"$in": result.inserted_ids}})
    resultDeleted: DeleteResult = sc.delete_many(
        {"_id": {"$in": result.inserted_ids}})


def deleteUserDataOlderThanThreeWeeks():
    ar = db["archive"]
    nowMinusThreeWeeks = str(datetime.now() - timedelta(weeks=3))
    resultDeleted: DeleteResult = ar.delete_many({
        "$or": [
            {"created-at": {"$lt":  nowMinusThreeWeeks}},
            {"revoked-at": {"$lt":  nowMinusThreeWeeks}}
        ]
    })
    return dict(resultDeleted)
