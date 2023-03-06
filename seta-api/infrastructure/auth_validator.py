from functools import wraps
from flask_jwt_extended import get_jwt, verify_jwt_in_request
from flask import jsonify
from infrastructure.ApiLogicError import ForbiddenResourceError

def auth_validator(role=None):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):                       
            verify_jwt_in_request()
            claims = get_jwt()
            print(claims,flush=True)
            print(role,flush=True)
            if role:
                if not (claims['role'] == role):
                    response = jsonify({"message": "Unauthorized access"})
                    response.status_code = 403
                    return response
            
            return fn(*args, **kwargs)
           
        return decorator
    return wrapper


def validate_view_permissions(sources):
    '''
    Verify that all resources in the `sources` are contained by the resource_permissions.view array of the decoded token.
    Return the list of view resources if `sources` are empty
    '''
    
    view_resources = None
    
    jwt = get_jwt()
    permissions = jwt.get("resource_permissions", None)
    if permissions:
        view_resources = permissions.get("view", None)
        if view_resources and sources:
            for s in sources:
                if not any(r.lower() == s.lower() for r in view_resources):
                    raise ForbiddenResourceError(resource_id=s)
    
    #user has no access to any public or community resources
    if view_resources is None:   
        raise ForbiddenResourceError(resource_id=None)
    
    #restrict query only to view_resources
    if sources is None:
        return view_resources
    
    return sources

def validate_add_permission(source: str) -> bool:
    '''
    Validate that the `source` is contained by the resource_permissions.add array of the decoded token
    '''
    
    if source is None:
        return False
    
    jwt = get_jwt()
    permissions = jwt.get("resource_permissions", None)
    if permissions:
        add_resources = permissions.get("add", None)
        
        if add_resources is not None:
            return any(r.lower() == source.lower() for r in add_resources)
    
    return False

def validate_delete_permission(source: str) -> bool:
    '''
    Validate that the `source` is contained by the resource_permissions.delete array of the decoded token
    '''
    
    if source is None:
        return False
    
    jwt = get_jwt()
    permissions = jwt.get("resource_permissions", None)
    if permissions:
        add_resources = permissions.get("delete", None)
        
        if add_resources is not None:
            return any(r.lower() == source.lower() for r in add_resources)
    
    return False