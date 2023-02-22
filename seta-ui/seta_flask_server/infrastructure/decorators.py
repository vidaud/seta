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

def auth_validator(role: str = None):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):            
            verify_jwt_in_request()
            jwt = get_jwt()

            if role and not (jwt['role'].lower() == role.lower()):
                response = jsonify({"message": "Unauthorized access"})
                response.status_code = 403
                return response
            
            return fn(*args, **kwargs)
           
        return decorator
    return wrapper    

'''
def system_scopes_validator(scopes: list() = None):
    def wrapper(fn):
        @wraps(fn)
        def decorator(self, *args, **kwargs):                       
            verify_jwt_in_request()
            identity = get_jwt_identity()
            
            user = self.usersBroker.get_user_by_id(identity["user_id"])
            current_app.logger.debug("system_scopes: " + str(user.system_scopes))
            
            return fn(self, *args, **kwargs)
           
        return decorator
    return wrapper
'''    