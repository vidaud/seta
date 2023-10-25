# Here is a custom decorator that verifies the JWT is present in the request,
# as well as insuring that the JWT has a claim indicating that this user is
# an administrator
from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt, verify_jwt_in_request


def auth_validator(role: str = None):
    """Authentication wrapper with specified role"""

    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            jwt = get_jwt()

            if role and jwt["role"].lower() != role.lower():
                response = jsonify({"message": "Unauthorized access"})
                response.status_code = 403
                return response

            return fn(*args, **kwargs)

        return decorator

    return wrapper
