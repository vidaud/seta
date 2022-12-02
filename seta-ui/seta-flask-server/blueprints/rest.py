from flask import Blueprint, json, request, abort, jsonify
from flask import current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity

from injector import inject
from repository.interfaces import IUsersBroker, IStatesBroker


rest = Blueprint("rest", __name__)

# POST - Set user data (by username, field name, and value)
@rest.route("/user/set/<username>", methods=["POST"])
@jwt_required()
@inject
def setUserData(username, userBroker: IUsersBroker):
    user = userBroker.get_user_by_username(username)

    if user is None:
        app.logger.warning("User not found in DB")

        response = {
            "authenticated": True,
            "status": "error",
            "message": "User not found in DB."
        }

    else:

        r = json.loads(request.data.decode("UTF-8"))

        userBroker.update_user(username, r["field"], r["value"])

        user = userBroker.get_user_by_username(username)

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
@inject
def deleteUserAccount(userBroker: IUsersBroker):
    r = json.loads(request.data.decode("UTF-8"))
    username = r["username"]
    
    user = userBroker.get_user_by_username(username)

    if user is None:
        app.logger.warning("User not found in DB")

        response = {
            "authenticated": True,
            "status": "error",
            "message": "User not found in DB."
        }
    else:
        userBroker.move_documents("users", "archive", {"username": username})
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

# GET - get all queries


@rest.route("/state/<username>/queries")
@jwt_required()
@inject
def getQueries(username, statesBroker: IStatesBroker):

    queries = statesBroker.get_corpus_queries(username)

    if queries is None:
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

# GET - Get state (by username and key)
@rest.route("/state/<username>/<key>")
@jwt_required()
@inject
def getState(username, key, statesBroker: IStatesBroker):

    state = statesBroker.get_state(username, key)

    if state is None:
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
@inject
def setState(username, userBroker: IUsersBroker, statesBroker: IStatesBroker):
    user = userBroker.get_user_by_username(username)

    if user is None:
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
        is_new = statesBroker.set_state(username, r["key"])
        if is_new:
            msg = "New state is successfully added."
        else:
            msg = "State updated correctly."
        
        state = statesBroker.get_state(username, r["key"])
        
        response = json.jsonify(
                {
                    "authenticated": True,
                    "status": "OK",
                    "message": msg,
                    "state": state,
                }
        )
        
    return response

@rest.route("/state/delete", methods=["POST"])
@jwt_required()
@inject
def deleteUserState(statesBroker: IStatesBroker):
    r = json.loads(request.data.decode("UTF-8"))
    username = r["username"]
    key = r["key"]

    state = statesBroker.get_state(username, key)

    if state is None:
        app.logger.warning("State not found in DB")

        response = {
            "authenticated": True,
            "status": "error",
            "message": "State not found in DB."
        }
    else:
        statesBroker.delete_state(username, key)

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
@rest.route("/user-info", methods=["GET"])
@jwt_required()
@inject
def user_details(usersBroker: IUsersBroker):
    """ Returns json with user details"""
    
    identity = get_jwt_identity()
    user = usersBroker.get_user_by_username(identity)
    
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
