# Here is a custom decorator that verifies the JWT is present in the request,
# as well as insuring that the JWT has a claim indicating that this user is
# an administrator
from functools import wraps

from flask import (Flask, Response, g, json, redirect, render_template,
                   request, send_from_directory, session, url_for)


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
