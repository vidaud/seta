from flask import Blueprint, json, request, abort, jsonify
from flask import current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity

from db.db_corpus_queries_broker import getAllCorpusQueries
from db.db_states_broker import addDbState, deleteDbState, getDbState, setDbState
from db.db_users_broker import getDbUser, moveDocuments, updateDbUser


rest = Blueprint("rest", __name__)


# GET - Get user (by username)
@rest.route("/user/get/<username>")
@jwt_required()
def getUserData(username):
    user = getDbUser(username)

    if user == None:
        app.logger.warning("User not found in DB")

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
    return response


# POST - Set user data (by username, field name, and value)
@rest.route("/user/set/<username>", methods=["POST"])
@jwt_required()
def setUserData(username):
    user = getDbUser(username)

    if user == None:
        app.logger.warning("User not found in DB")

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
    return response

# POST - Delete user (by username)


@rest.route("/user/delete", methods=["POST"])
@jwt_required()
def deleteUserAccount():
    r = json.loads(request.data.decode("UTF-8"))
    username = r["username"]
    
    user = getDbUser(username)

    if user == None:
        app.logger.warning("User not found in DB")

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
    return response


# GET - Get state (by username and key)
@rest.route("/state/<username>/<key>")
@jwt_required()
def getState(username, key):

    state = getDbState(username, key)

    if state == None:
        app.logger.warning("No state with key " + key + " found for user.")

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
    return response


# POST - Set state, given the username, key and value
@rest.route("/state/<username>", methods=["POST"])
@jwt_required()
def setState(username):
    user = getDbUser(username)

    if user == None:
        app.logger.warning("User not found in DB")

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

    return response

# POST


@rest.route("/state/delete", methods=["POST"])
@jwt_required()
def deleteUserState():
    r = json.loads(request.data.decode("UTF-8"))
    username = r["username"]
    key = r["key"]

    state = getDbState(username, key)

    if state == None:
        app.logger.warning("State not found in DB")

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
    return response

# Custom non-pure REST calls:

# GET - get all queries


@rest.route("/state/<username>/queries")
@jwt_required()
def getQueries(username):

    queries = getAllCorpusQueries(username)

    if queries == None:
        app.logger.warning("No queries have been found for this user.")

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
    return response

@rest.route("/user-info", methods=["GET"])
@jwt_required()
def user_details():
    """ Returns json with user details"""
    
    identity = get_jwt_identity()
    user = getDbUser(identity)
    
    if not user:
        abort(404, "User not found in the database!")
    
    role = "user"
    if "role" in user:
        role = user["role"]
    return jsonify({
                    "username": user["username"], 
                    "firstName": user["first_name"], 
                    "lastName": user["last_name"], 
                    "email": user["email"],
                    "role": role
                }), 200
