import requests
from flask import Blueprint
from flask import send_from_directory

base_routes = Blueprint("base_routes", __name__)


@base_routes.route('/')
def send_index():
    return send_from_directory("./seta-ui", "index.html")
    # return base_routes.make_response(open("./dist/seta-web/index.html").read())

@base_routes.route("/<path:path>")
def send_js(path):
    print(path)
    return send_from_directory("./seta-ui/", path)

@base_routes.route("/<path>")
def react_path(path):
    return send_from_directory("./seta-ui/", "index.html")