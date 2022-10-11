from flask import Blueprint, json, request
from flask_jwt_extended import jwt_required

from db.db_corpus_queries_broker import getAllCorpusQueries
from db.db_states_broker import addDbState, deleteDbState, getDbState, setDbState
from db.db_users_broker import getDbUser, moveDocuments, updateDbUser


rest = Blueprint("rest", __name__)


@rest.before_request
@jwt_required()
def before_request():
    print("in before_request")
    pass


# GET - Get user (by username)
@rest.route("/rest/user/get/<username>")
@jwt_required()
def getUserData(username):
    # authentication = authenticateJwt(username)

    # if not authentication["authenticated"]:
    #     return authentication

    user = getDbUser(username)

    if user == None:
        print("User not found in DB")

        response = {
            "authenticated": True,
            "status": "error",
            "message": "User not found"
        }
    else:
        response = {
            "authenticated": True,
            "status": "OK",
            "user": user,
            "message": "User retrieved successfully"
        }

    response = json.jsonify(response)

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


# POST - Set user data (by username, field name, and value)
@rest.route("/rest/user/set/<username>", methods=["POST"])
@jwt_required()
def setUserData(username):
    # authentication = authenticateJwt(username)

    # if not authentication["authenticated"]:
    #     return authentication

    user = getDbUser(username)

    if user == None:
        print("User not found in DB")

        response = {
            "authenticated": True,
            "status": "error",
            "message": "User not found in DB."
        }

    else:

        r = json.loads(request.data.decode("UTF-8"))

        updateDbUser(username, r["field"], r["value"])

        user = getDbUser(username)

        # Return response
        response = {
            "authenticated": True,
            "status": "OK",
            "message": "User updated correctly.",
            "user": user
        }

    response = json.jsonify(response)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

# POST - Delete user (by username)


@rest.route("/rest/user/delete", methods=["POST"])
@jwt_required()
def deleteUserAccount():
    r = json.loads(request.data.decode("UTF-8"))
    username = r["username"]

    # authentication = authenticateJwt(username)

    # if not authentication["authenticated"]:
    #     return authentication

    user = getDbUser(username)

    if user == None:
        print("User not found in DB")

        response = {
            "authenticated": True,
            "status": "error",
            "message": "User not found in DB."
        }
    else:
        moveDocuments("users", "archive", {"username": username})
        # deleteAllDbUserData(username)

        # Return response
        response = {
            "authenticated": True,
            "status": "OK",
            "message":
            "All user data successfully deleted.",
            "username": username
        }

    response = json.jsonify(response)

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


# GET - Get state (by username and key)
@rest.route("/rest/state/<username>/<key>")
@jwt_required()
def getState(username, key):
    # authentication = authenticateJwt(username)

    # if not authentication["authenticated"]:
    #     return authentication

    state = getDbState(username, key)

    if state == None:
        print("No state with key " + key + " found for user.")

        response = {
            "authenticated": True,
            "status": "error",
            "message": "No state with given key exists."
        }

    else:
        response = {
            "authenticated": True,
            "status": "OK",
            "state": state
        }

    response = json.jsonify(response)

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


# POST - Set state, given the username, key and value
@rest.route("/rest/state/<username>", methods=["POST"])
@jwt_required()
def setState(username):
    # authentication = authenticateJwt(username)

    # if not authentication["authenticated"]:
    #     return authentication

    user = getDbUser(username)

    if user == None:
        print("User not found in DB")

        response = json.jsonify(
            {
                "authenticated": True,
                "status": "error",
                "message": "User not found in DB."
            }
        )
    else:
        r = json.loads(request.data.decode("UTF-8"))
        print(r["value"])
        state = getDbState(username, r["key"])

        if state == None:
            # print("No state with key " + r["key"] + " found. Adding the state.")
            addDbState(username, r["key"], r["value"])
            state = getDbState(username, r["key"])
            response = json.jsonify(
                {
                    "authenticated": True,
                    "status": "OK",
                    "message": "New state is successfully added.",
                    "state": state,
                }
            )
        else:
            # print("State already exists. Setting the state to given value")

            setDbState(username, r["key"], r["value"])
            state = getDbState(username, r["key"])
            response = json.jsonify(
                {
                    "authenticated": True,
                    "status": "OK",
                    "message": "State updated correctly.",
                    "state": state,
                }
            )

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

# POST


@rest.route("/rest/state/delete", methods=["POST"])
@jwt_required()
def deleteUserState():
    r = json.loads(request.data.decode("UTF-8"))
    username = r["username"]
    key = r["key"]

    # authentication = authenticateJwt(username)

    # if not authentication["authenticated"]:
    #     return authentication

    # user = getDbUser(username)
    state = getDbState(username, key)

    if state == None:
        print("State not found in DB")

        response = {
            "authenticated": True,
            "status": "error",
            "message": "State not found in DB."
        }
    else:
        deleteDbState(username, key)

        # Return response
        response = {
            "authenticated": True,
            "status": "OK",
            "message": "State successfully deleted.",
            "key": key
        }

    response = json.jsonify(response)

    response.headers.add("Access-Control-Allow-Origin", "*")

    return response

# Custom non-pure REST calls:

# GET - get all queries


@rest.route("/rest/state/<username>/queries")
@jwt_required()
def getQueries(username):
    # authentication = authenticateJwt(username)

    # if not authentication["authenticated"]:
    #     return authentication

    queries = getAllCorpusQueries(username)

    if queries == None:
        print("No queries have been found for this user.")

        response = {
            "authenticated": True,
            "status": "error",
            "message": "No state with given key exists."
        }

    else:
        response = {
            "authenticated": True,
            "status": "OK",
            "state": queries
        }

    response = json.jsonify(response)

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


# Try to get a restricted resource
@rest.route("/rest/ec-restricted/<username>/<resource>")
@jwt_required()
def getEcRestrictedResource(username="", resource=""):
    # authentication = authenticateJwt(username)

    # if not authentication["authenticated"]:
    #     return authentication

    # authorized = checkIfAuthorized(authentication["decodedToken"], resource)

    # if authorized:
    response = json.jsonify(
        {
            "status": "OK",
            "message": "You are authorized.",
            "resource": "some very restricted resource",
        }
    )

    # else:
    #     response = json.jsonify(
    #         {"status": "error", "message": "You are not authorized."}
    #     )

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
