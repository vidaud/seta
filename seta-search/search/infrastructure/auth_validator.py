from functools import wraps
from flask_jwt_extended import get_jwt, verify_jwt_in_request
from flask import jsonify
from search.infrastructure.ApiLogicError import ForbiddenResourceError

def auth_validator(role=None):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()

            if role:
                claims = get_jwt()

                if not (claims["role"] == role):
                    response = jsonify({"message": "Unauthorized access"})
                    response.status_code = 403
                    return response

            return fn(*args, **kwargs)

        return decorator

    return wrapper


def validate_view_permissions(sources: list[str]) -> list[str]:
    """
    Verify that all resources in the `sources` are contained by the resource_permissions.view array of the decoded token.
    Return the list of view resources if `sources` are empty
    """

    view_resources = get_resource_permissions("view")

    # user has no access to any public or community resources
    if not view_resources:
        raise ForbiddenResourceError(resource_id=None)

    # restrict query only to view_resources
    if sources is None:
        return [r["resource_id"] for r in view_resources]
    else:
        for s in sources:
            if not any(r["resource_id"].lower() == s.lower() for r in view_resources):
                raise ForbiddenResourceError(resource_id=s)

    return sources


def validate_add_permission(source: str) -> bool:
    """
    Validate that the `source` is contained by the resource_permissions.ownership array of the decoded token
    """

    return _validate_source_permission(source=source, permission="ownership")


def validate_delete_permission(source: str) -> bool:
    """
    Validate that the `source` is contained by the resource_permissions.ownership array of the decoded token
    """

    return _validate_source_permission(source=source, permission="ownership")


def get_resource_permissions(permission: str) -> list[dict]:
    """
    Return the list of {community_id: str, resource_id: str} from 'resource_permissions' inside JWT token

    Important: 'add' & 'delete' lists have value only for the resource_id property

    :param permission:
        One of 'view', 'ownership'
    """

    jwt = get_jwt()
    permissions = jwt.get("resource_permissions", None)
    if permissions:
        return permissions.get(permission, None)

    return None


def _validate_source_permission(source: str, permission: str) -> bool:
    if source is None:
        return False

    resources = get_resource_permissions(permission)
    if resources is not None:
        return any(r["resource_id"].lower() == source.lower() for r in resources)
    
    return False
