# Here is a custom decorator that verifies the JWT is present in the request,
# as well as insuring that the JWT has a claim indicating that this user is
# an administrator
from functools import wraps

from flask import session
from flask import jsonify
from flask_jwt_extended import get_jwt, verify_jwt_in_request



def pop_session():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            session.pop("username", None)
            session.pop("user_attributes", None)
            return fn(*args, **kwargs)
            # return json.jsonify(msg="Session deleted!")
        return decorator

    return wrapper

def role_validator(role):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):                       
            verify_jwt_in_request()
            claims = get_jwt()

            print(claims,flush=True)
            print(role,flush=True)

            if not (claims['role'] == role):
                response = jsonify({"message": "Unauthorized access"})
                response.status_code = 403
                return response
            
            return fn(*args, **kwargs)
           
        return decorator
    return wrapper    
