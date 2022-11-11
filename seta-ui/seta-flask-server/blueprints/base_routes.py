import requests
from flask import Blueprint, Response
from flask import current_app as app
from flask import request, send_from_directory

base_routes = Blueprint("base_routes", __name__)


@base_routes.route("/")
def send_index():
    return send_from_directory("./seta-ui", "index.html")
    # return base_routes.make_response(open("./dist/seta-web/index.html").read())


@base_routes.route("/<path:path>")
def send_js(path):
    return send_from_directory("./seta-ui/", path)

'''
@base_routes.route("/rest/<path:path>", methods=["GET", "POST"])
def proxy(path):
    # print(request.__dict__.items())
    mimetype = request.mimetype
    protocol = "https"
    if app.config['FLASK_ENV'] == "dev" or app.config['FLASK_ENV'] == "docker":
        protocol = "http"
        
    app.logger.debug(f'Before: {request.url}')
    
    url = (
        protocol
        + "://"
        + app.config["API_TARGET_PATH"]
        + "/"
        + path
        # + "?"
        # + request.query_string.decode("utf-8")
    )
    
    app.logger.debug(f'After: {url}')
    
    if (request.method == 'GET'):
        r = requests.get(url + f'?{request.query_string.decode("utf-8")}',
                         headers={"Authorization": request.headers["Authorization"]})
    else:
        r = requests.post(url, data=request.data, headers={"Authorization": request.headers["Authorization"]})
    return Response(r.content, mimetype=mimetype)
'''