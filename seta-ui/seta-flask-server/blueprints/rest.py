from flask import Blueprint, json, request, abort, jsonify
from flask import current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity

from injector import inject
from repository.interfaces import IUsersBroker, IStatesBroker


rest = Blueprint("rest", __name__)

# POST - Set user data (by username, field name, and value)
'''
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

    return jsonify(response)
'''

# POST - Delete user (by username)


@rest.route("/user/delete", methods=["POST"])
@jwt_required()
@inject
def deleteUserAccount(userBroker: IUsersBroker):
    identity = get_jwt_identity()
    
    user = userBroker.get_user_by_id(identity["user_id"])

    if user is None:
        app.logger.warning("User not found in DB")

        response = {
            "authenticated": True,
            "status": "error",
            "message": "User not found in DB."
        }
    else:
        userBroker.move_documents("users", "archive", {"user_id": user.user_id})

        # Return response
        response = {
            "authenticated": True,
            "status": "OK",
            "message":
            "All user data successfully deleted.",
            "user_id": user.user_id
        }
    
    return jsonify(response)

# GET - get all queries


@rest.route("/state/<username>/queries")
@jwt_required()
@inject
def getQueries(username, statesBroker: IStatesBroker):
    identity = get_jwt_identity()
    queries = statesBroker.get_corpus_queries(identity["user_id"])

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
            "state": {
                "username": queries["user_id"],
                "key": queries["query_key"],
                "value": queries["query_value"]
            }
        }
    
    return jsonify(response)

# GET - Get state (by username and key)
@rest.route("/state/<username>/<key>")
@jwt_required()
@inject
def getState(username, key, statesBroker: IStatesBroker):
    identity = get_jwt_identity()
    state = statesBroker.get_state(identity["user_id"], key)

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
            "state": {
                "username": state["user_id"],
                "key": state["query_key"],
                "value": state["query_value"]
            }
        }
    
    return jsonify(response)


# POST - Set state, given the username, key and value
@rest.route("/state/<username>", methods=["POST"])
@jwt_required()
@inject
def setState(username, statesBroker: IStatesBroker):
    identity = get_jwt_identity()
    
    r = json.loads(request.data.decode("UTF-8"))
    app.logger.debug(r["value"])
    
    is_new = statesBroker.set_state(identity["user_id"], r["key"], r["value"])
    if is_new:
        msg = "New state is successfully added."
    else:
        msg = "State updated correctly."
        
    response = jsonify(
            {
                "authenticated": True,
                "status": "OK",
                "message": msg,
                "state": {
                    "username": identity["user_id"],
                    "key": r["key"],
                    "value":  r["value"],
                }
            }
    )
        
    return response

@rest.route("/state/delete", methods=["POST"])
@jwt_required()
@inject
def deleteUserState(statesBroker: IStatesBroker):
    identity = get_jwt_identity()
    
    r = json.loads(request.data.decode("UTF-8"))
    key = r["key"]

    statesBroker.delete_state(identity["user_id"], key)

    # Return response
    response = {
        "authenticated": True,
        "status": "OK",
        "message": "State successfully deleted.",
        "key": key
    }

    return jsonify(response)

# Custom non-pure REST calls:
@rest.route("/user-info", methods=["GET"])
@jwt_required()
@inject
def user_details(usersBroker: IUsersBroker):
    """ Returns json with user details"""
    
    identity = get_jwt_identity()    
    user = usersBroker.get_user_by_id_and_provider(user_id=identity["user_id"], provider_uid=identity["provider_uid"], provider=identity["provider"])
    
    if user is None:
        app.logger.error(f"User {str(identity)} not found in the database!")
        abort(404, "User not found in the database!")

    return jsonify({
            "username": user.user_id, 
            "firstName": user.authenticated_provider.first_name, 
            "lastName": user.authenticated_provider.last_name,
            "email": user.email,
            "role": user.role
            })
