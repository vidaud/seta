
import time

import jwt
from flask import request
from flask import current_app as app

from db.db_revoked_tokens_broker import isTokenRevoked


# Check if JWT is genuine and belongs to the user for which the resource is requested
# (i.e. the argument "username" has to be the same as the username in JWT)
def authenticateJwt(username):
    
    auth_header = request.headers.get("Authorization")
    if auth_header:
        jwt_token = auth_header.split(" ")[1]
    else:
        jwt_token = ""

    # Check that token can be properly decoded
    try:
        decodedToken = jwt.decode(jwt_token, app.config['SECRET_KEY'], algorithms=["HS256"])
    except:
        msg = "Token is not valid."
        return {
            "status": "error", 
            "authenticated": False, 
            "message": msg
        }

    if decodedToken["user"]["uid"] != username:
        
        return {
            "status": "error", 
            "authenticated": False, 
            "message": "Username in the JWT token does not match the username being requested."
        }

    # Check if JWT is not expired
    timePassed = time.time() - decodedToken["iat"]

    if timePassed > app.config['JWT_EXPIRY_INTERVAL']:
        return {
            "status": "error",
            "authenticated": False,
            "message": "JWT is expired",
            "expired": True,
        }
    
    # Check that JWT is not revoked
    if isTokenRevoked(username, jwt_token):
        return { 
            "status": "error",
            "authenticated": False,
            "message": "Token is revoked."
        }

    # 1. JWT is valid and authenticated,
    # 2. authorized (username parameter is equal from username from JWT), 
    # 3. JWT is not expired
    # 4. JWT is not revoked
    return {
        "status": "OK",
        "authenticated": True,
        "message": "Token successfully verified for given user.",
        "decodedToken": decodedToken,
    }


# Authorization method, based on the decoded token, decide if the user's domain
# is authorized to access that resource
def checkIfAuthorized(decodedToken, resource) -> bool:
    domain = decodedToken["user"]["domain"]

    if domain == "eu.europa.ec":
        isAuthorized = True
    else:
        isAuthorized = False

    # TO DO: Additional checks for the resource in question
    # .....
    print(resource)

    return isAuthorized



# Endpoint for revoking the current users access token. Save the JWTs unique
# identifier (jti) in redis. Also set a Time to Live (TTL)  when storing the JWT
# so that it will automatically be cleared out of redis after the token expires.
