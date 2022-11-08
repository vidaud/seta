from functools import wraps
from flask_jwt_extended import get_jwt, verify_jwt_in_request
from flask import jsonify

def auth_validator(role=None):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):                       
            verify_jwt_in_request()
            claims = get_jwt()
            
            if role:
                if not (claims['role'] == role):
                    return jsonify({"msg": "Unauthorized access"}), 403                    
            
            return fn(*args, **kwargs)
           
        return decorator
    return wrapper